import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import LoadingButton from "@mui/lab/LoadingButton";
import Autocomplete from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import InputBase from "@mui/material/InputBase";
import Stack from "@mui/material/Stack";
import { GridColumns, GridRowId } from "@mui/x-data-grid";
import { DataTable } from "@ui";
import { useFormik } from "formik";
import { Fragment, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  AccessItem,
  useFetchRoleByIDQuery,
  useUpdateRoleAccessMutation,
} from "@services/admin/rolesApi";
import { useFetchInterfaceListQuery } from "@services/generalApi";

interface FormAccessItem extends AccessItem {
  creatable?: boolean;
}

const gridColumnProps = {
  type: "actions",
  width: 52,
  field: "a7",
  sortable: false,
  filterable: false,
};

export default function Access({ id }: { id: string | number }) {
  const roleId = typeof id === "string" ? parseInt(id) : id;
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([]);
  const interfaceListQuery = useFetchInterfaceListQuery();
  const { data, isFetching, refetch } = useFetchRoleByIDQuery(id, {
    refetchOnMountOrArgChange: true,
  });
  const [update, { isLoading, isError, isSuccess }] =
    useUpdateRoleAccessMutation();
  const {
    handleSubmit,
    handleChange,
    values,
    setValues,
    setFieldValue,
    setFormikState,
  } = useFormik<FormAccessItem[]>({
    initialValues: [],
    onSubmit(values) {
      const data = {
        id: roleId,
        access: values.filter((item) => item.displayName),
      };
      update(data);
    },
  });
  const interfaceList = (interfaceListQuery.data?.items || []).filter(
    (item) => values.findIndex((elm) => elm.interfaceId === item.id) === -1
  );
  const columns = useMemo<GridColumns<FormAccessItem>>(() => {
    return [
      {
        flex: 2,
        type: "actions",
        align: "left",
        field: "displayName",
        sortable: false,
        filterable: false,
        headerName: "Название раздела",
        renderCell: (params) => {
          if (params.row.creatable) {
            const index = values.findIndex(
              (item) => item.interfaceId === params.row.interfaceId
            );
            return (
              <Autocomplete
                value={{
                  id: values[index].interfaceId,
                  pageName: values[index].pageName,
                  displayName: values[index].displayName,
                }}
                options={interfaceList}
                loading={interfaceListQuery.isFetching}
                disabled={isLoading}
                fullWidth
                renderInput={({ InputLabelProps, InputProps, ...rest }) => (
                  <InputBase
                    {...InputProps}
                    {...rest}
                    placeholder="Выберите раздел"
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props} key={option.id}>
                    {option.displayName}
                  </li>
                )}
                getOptionLabel={(option) => option.displayName}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(event, value) => {
                  if (value) {
                    setFieldValue(`[${index}]`, {
                      ...values[index],
                      interfaceId: value.id,
                      pageName: value.pageName,
                      displayName: value.displayName,
                      a1_Title: value.a1_Title,
                      a2_Title: value.a2_Title,
                      a3_Title: value.a3_Title,
                      a4_Title: value.a4_Title,
                      a5_Title: value.a5_Title,
                      a6_Title: value.a6_Title,
                      a7_Title: value.a7_Title,
                      a8_Title: value.a8_Title,
                      a9_Title: value.a9_Title,
                      a10_Title: value.a10_Title,
                      a11_Title: value.a11_Title,
                      a12_Title: value.a12_Title,
                    });
                  }
                }}
              />
            );
          }
          return params.row.displayName;
        },
      },
      {
        ...gridColumnProps,
        field: "a1",
        headerName: "a1",
        renderCell: (params) => {
          const index = values.findIndex(
            (item) => item.interfaceId === params.row.interfaceId
          );
          return (
            <Checkbox
              name={`[${index}]a1`}
              title={params.row.a1_Title}
              checked={params.row.a1}
              onChange={handleChange}
            />
          );
        },
      },
      {
        ...gridColumnProps,
        field: "a2",
        headerName: "a2",
        renderCell: (params) => {
          const index = values.findIndex(
            (item) => item.interfaceId === params.row.interfaceId
          );
          return (
            <Checkbox
              name={`[${index}]a2`}
              title={params.row.a2_Title}
              checked={params.row.a2}
              onChange={handleChange}
            />
          );
        },
      },
      {
        ...gridColumnProps,
        field: "a3",
        headerName: "a3",
        renderCell: (params) => {
          const index = values.findIndex(
            (item) => item.interfaceId === params.row.interfaceId
          );
          return (
            <Checkbox
              name={`[${index}]a3`}
              title={params.row.a3_Title}
              checked={params.row.a3}
              onChange={handleChange}
            />
          );
        },
      },
      {
        ...gridColumnProps,
        field: "a4",
        headerName: "a4",
        renderCell: (params) => {
          const index = values.findIndex(
            (item) => item.interfaceId === params.row.interfaceId
          );
          return (
            <Checkbox
              name={`[${index}]a4`}
              title={params.row.a4_Title}
              checked={params.row.a4}
              onChange={handleChange}
            />
          );
        },
      },
      {
        ...gridColumnProps,
        field: "a5",
        headerName: "a5",
        renderCell: (params) => {
          const index = values.findIndex(
            (item) => item.interfaceId === params.row.interfaceId
          );
          return (
            <Checkbox
              name={`[${index}]a5`}
              title={params.row.a5_Title}
              checked={params.row.a5}
              onChange={handleChange}
            />
          );
        },
      },
      {
        ...gridColumnProps,
        field: "a6",
        headerName: "a6",
        renderCell: (params) => {
          const index = values.findIndex(
            (item) => item.interfaceId === params.row.interfaceId
          );
          return (
            <Checkbox
              name={`[${index}]a6`}
              title={params.row.a6_Title}
              checked={params.row.a6}
              onChange={handleChange}
            />
          );
        },
      },
      {
        ...gridColumnProps,
        field: "a7",
        headerName: "a7",
        renderCell: (params) => {
          const index = values.findIndex(
            (item) => item.interfaceId === params.row.interfaceId
          );
          return (
            <Checkbox
              name={`[${index}]a7`}
              title={params.row.a7_Title}
              checked={params.row.a7}
              onChange={handleChange}
            />
          );
        },
      },
      {
        ...gridColumnProps,
        field: "a8",
        headerName: "a8",
        renderCell: (params) => {
          const index = values.findIndex(
            (item) => item.interfaceId === params.row.interfaceId
          );
          return (
            <Checkbox
              name={`[${index}]a8`}
              title={params.row.a8_Title}
              checked={params.row.a8}
              onChange={handleChange}
            />
          );
        },
      },
      {
        ...gridColumnProps,
        field: "a9",
        headerName: "a9",
        renderCell: (params) => {
          const index = values.findIndex(
            (item) => item.interfaceId === params.row.interfaceId
          );
          return (
            <Checkbox
              name={`[${index}]a9`}
              title={params.row.a9_Title}
              checked={params.row.a9}
              onChange={handleChange}
            />
          );
        },
      },
      {
        ...gridColumnProps,
        field: "a10",
        headerName: "a10",
        renderCell: (params) => {
          const index = values.findIndex(
            (item) => item.interfaceId === params.row.interfaceId
          );
          return (
            <Checkbox
              name={`[${index}]a10`}
              title={params.row.a10_Title}
              checked={params.row.a10}
              onChange={handleChange}
            />
          );
        },
      },
      {
        ...gridColumnProps,
        field: "a11",
        headerName: "a11",
        renderCell: (params) => {
          const index = values.findIndex(
            (item) => item.interfaceId === params.row.interfaceId
          );
          return (
            <Checkbox
              name={`[${index}]a11`}
              title={params.row.a11_Title}
              checked={params.row.a11}
              onChange={handleChange}
            />
          );
        },
      },
      {
        ...gridColumnProps,
        field: "a12",
        headerName: "a12",
        renderCell: (params) => {
          const index = values.findIndex(
            (item) => item.interfaceId === params.row.interfaceId
          );
          return (
            <Checkbox
              name={`[${index}]a12`}
              title={params.row.a12_Title}
              checked={params.row.a12}
              onChange={handleChange}
            />
          );
        },
      },
    ];
  }, [
    handleChange,
    interfaceList,
    interfaceListQuery.isFetching,
    isLoading,
    setFieldValue,
    values,
  ]);
  const handleDeleteAccess = () => {
    const creatable = values.filter(
      (item) => item.creatable && selectedRows.includes(item.interfaceId)
    );
    if (creatable.length) {
      setValues(
        values.filter(
          (item) =>
            (item.creatable && !selectedRows.includes(item.interfaceId)) ||
            item.creatable === undefined
        )
      );
    }
    const saved = values
      .filter(
        (item) =>
          item.creatable === undefined &&
          selectedRows.includes(item.interfaceId)
      )
      .map((item) => item.interfaceId);
    if (saved.length) {
      const data = {
        id: roleId,
        access: values
          .filter((item) => !("creatable" in item))
          .filter((item) => !saved.includes(item.interfaceId)),
      };
      update(data);
    }
  };
  const handleAddRow = () => {
    setValues([
      {
        interfaceId: Date.now(),
        role_Id: roleId,
        pageName: "",
        displayName: "",
        creatable: true,
        a1: true,
        a2: true,
        a3: true,
        a4: true,
        a5: true,
        a6: true,
        a7: true,
        a8: true,
        a9: true,
        a10: true,
        a11: true,
        a12: true,
      },
      ...values,
    ]);
  };

  useEffect(() => {
    if (!isFetching && data?.access) {
      setFormikState((state) => ({
        ...state,
        values: [
          ...state.values
            .filter((item) => item.creatable)
            .filter(
              (item) =>
                data.access.findIndex(
                  (elm) => elm.interfaceId === item.interfaceId
                ) === -1
            ),
          ...data.access,
        ],
      }));
    }
  }, [isFetching, data, setFormikState]);

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
      refetch();
    }
  }, [isError, isSuccess, refetch]);

  return (
    <Fragment>
      <Divider textAlign="left">Доступ по разделам</Divider>
      <form onSubmit={handleSubmit}>
        <Stack direction="row" spacing={3} className="tw-mb-4">
          <LoadingButton
            type="submit"
            variant="outlined"
            loading={isLoading}
            disabled={values.length === 0}
          >
            Сохранить
          </LoadingButton>
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
        <DataTable
          items={values}
          columns={columns}
          getRowId={(params: FormAccessItem) => params.interfaceId}
          isLoading={isFetching || isLoading}
          totalItems={values.length}
          selectionModel={selectedRows}
          showCellRightBorder
          showColumnRightBorder
          onSelectionModelChange={setSelectedRows}
        />
      </form>
    </Fragment>
  );
}
