import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import LoadingButton from "@mui/lab/LoadingButton";
import Autocomplete from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";
import InputBase from "@mui/material/InputBase";
import Stack from "@mui/material/Stack";
import { GridColumns, GridRowId } from "@mui/x-data-grid";
import { DataTable } from "@ui";
import { FormikProps, useFormik } from "formik";
import { Fragment, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  IUpdateRoleAccessModule,
  useFetchModulesForAccessQuery,
  useLazyFetchRoleByIDQuery,
  useUpdateRoleAccessModuleMutation,
} from "@services/admin/rolesApi";

interface IModuleAccess {
  id: number;
  formik?: FormikProps<any>;
}

const gridColumnProps = {
  type: "actions",
  width: 52,
  field: "a7",
  sortable: false,
  filterable: false,
};

export default function ModuleAccess({ id, formik }: IModuleAccess) {
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([]);
  const [refetch, { data, isFetching }] = useLazyFetchRoleByIDQuery();
  const [update, { isLoading, isError, isSuccess }] =
    useUpdateRoleAccessModuleMutation();

  const initialValues = useMemo(() => {
    return {
      id: 0,
      modulAccess: {
        items: data?.modulAccess
          ? data.modulAccess.map((item) => ({
              ...item,
              id: Math.random().toString(26),
            }))
          : [],
      },
    };
  }, [data]);

  useEffect(() => {
    if (id) {
      refetch(id);
    }
  }, [id]);

  const formikInner = useFormik<IUpdateRoleAccessModule>({
    initialValues,
    enableReinitialize: true,
    onSubmit(values) {
      update({
        id,
        modulAccess: values.modulAccess,
      });
    },
  });

  const { handleSubmit, handleChange, values, setFieldValue } =
    formik || formikInner;
  const modules = useFetchModulesForAccessQuery();
  const columns = useMemo<GridColumns<any>>(() => {
    return [
      {
        flex: 4,
        type: "actions",
        align: "left",
        field: "name",
        sortable: false,
        filterable: false,
        headerName: "Название модуля",
        renderCell: (params) => {
          const index = values.modulAccess.items.findIndex(
            (item: any) => item.id === params.row.id
          );
          return (
            <Autocomplete
              value={params.row}
              options={modules.data?.items || []}
              fullWidth
              renderInput={({ InputLabelProps, InputProps, ...rest }) => (
                <InputBase
                  {...InputProps}
                  {...rest}
                  placeholder="Выберите модуль"
                />
              )}
              renderOption={(props, option) => (
                <li {...props}>{option.name}</li>
              )}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) =>
                option.subModulId === value.subModulId
              }
              onChange={(event, value) => {
                if (value) {
                  setFieldValue(`modulAccess.items.${String(index)}`, {
                    ...value,
                    id: Math.random().toString(26),
                  });
                }
              }}
            />
          );
        },
      },
      {
        ...gridColumnProps,
        flex: 1,
        field: "enabled",
        headerName: "Доступ",
        renderCell: (params) => {
          const index = values.modulAccess.items?.findIndex(
            (item: any) => item.id === params.row.id
          );
          return (
            <Checkbox
              name={`modulAccess.items.${index}.enable`}
              checked={params.row.enable}
              onChange={handleChange}
            />
          );
        },
      },
    ];
  }, [
    handleChange,
    modules.data?.items,
    setFieldValue,
    values.modulAccess.items,
  ]);

  const handleDeleteAccess = () => {
    setFieldValue(
      "modulAccess.items",
      values.modulAccess.items.filter(
        (item: any) =>
          selectedRows.findIndex((row) => String(row) === item.id) === -1
      )
    );
  };

  const handleAddRow = () => {
    setFieldValue("modulAccess.items", [
      {
        id: Math.random().toString(26),
        subModulId: 0,
        enable: false,
        name: "",
      },
      ...(values.modulAccess.items || []),
    ]);
  };

  useEffect(() => {
    if (isError) {
      toast("Произошла ошибка. Попробуйте повторить позже.", {
        type: "error",
        position: "bottom-right",
      });
    }
    if (isSuccess) {
      toast("Доступы обновлены.", {
        type: "success",
        position: "bottom-right",
      });
      refetch(id);
    }
  }, [isError, isSuccess, refetch, id]);

  const [section1, section2] = useMemo(
    () => [
      values?.modulAccess?.items.slice(
        0,
        Math.ceil(values.modulAccess.items?.length / 2)
      ),
      values?.modulAccess?.items.slice(
        Math.ceil(values.modulAccess.items?.length / 2)
      ),
    ],
    [values.modulAccess.items]
  );

  return (
    <Fragment>
      <form onSubmit={handleSubmit}>
        <Stack direction="row" spacing={3} className="tw-mb-4">
          {!formik && (
            <LoadingButton
              type="submit"
              variant="outlined"
              loading={isLoading}
              disabled={values.length === 0}
            >
              Сохранить
            </LoadingButton>
          )}
          <LoadingButton
            color="success"
            variant="outlined"
            loading={isLoading}
            startIcon={<AddIcon />}
            onClick={handleAddRow}
          >
            Добавить
          </LoadingButton>
          <LoadingButton
            color="error"
            variant="outlined"
            loading={isLoading}
            disabled={selectedRows.length === 0}
            startIcon={<DeleteIcon />}
            onClick={handleDeleteAccess}
          >
            Удалить
          </LoadingButton>
        </Stack>
        <div className="tw-flex tw-gap-2">
          <div className="tw-flex-1">
            <DataTable
              items={section1}
              columns={columns}
              getRowId={(params: any) => params.id}
              isLoading={isFetching || isLoading}
              totalItems={section1?.length}
              selectionModel={selectedRows}
              showCellRightBorder
              showColumnRightBorder
              onSelectionModelChange={setSelectedRows}
            />
          </div>
          <div className="tw-flex-1">
            <DataTable
              items={section2}
              columns={columns}
              getRowId={(params: any) => params.id}
              isLoading={isFetching || isLoading}
              totalItems={section2?.length}
              selectionModel={selectedRows}
              showCellRightBorder
              showColumnRightBorder
              onSelectionModelChange={setSelectedRows}
            />
          </div>
        </div>
      </form>
    </Fragment>
  );
}
