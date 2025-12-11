import { ChangeEvent, useEffect, useMemo, useState, Fragment } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Button,
  TextField,
  Stack,
  Autocomplete,
  Divider,
  Checkbox,
  IconButton,
} from "@mui/material";
import { GridColumns, GridRowId } from "@mui/x-data-grid";
import { DataTable, Tabs, Tab, TabPanel } from "@ui";
import { FormikProps, useFormik } from "formik";
import { toast } from "react-toastify";
import {
  AccessItem,
  UpdateRoleAccessRequestBody,
  RoleList,
  useGetRoleByIDMutation,
  useUpdateRoleAccessMutation,
  useFetchRoleListForSelectQuery,
} from "@services/admin/rolesApi";

import Add from "./add";
import { RoleDetails } from "@services/admin/userApi";
import ModuleAccess from "@root/components/admin/Roles/modules-access";

const gridColumnProps = {
  type: "actions",
  width: 52,
  field: "a7",
  sortable: false,
  filterable: false,
};

interface AccessProps {
  id?: number | string;
  onChange?: (values: any) => void;
  disabled?: boolean;
  data?: RoleDetails[];
  formik?: FormikProps<any>;
}

interface ITab {
  roleName?: string;
  id?: string | number;
}
interface StateProps {
  selected: any;
  tab?: any;
}

export default function Access({
  id,
  onChange,
  disabled = false,
  data,
  formik,
}: AccessProps) {
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([]);
  const [state, setState] = useState<StateProps>({
    selected: null,
  });
  const [moduleAccess, setModuleAccess] = useState(false);

  useEffect(() => {
    if (!!data) {
      setValues(data);
    }
  }, [data]);

  const { data: roles } = useFetchRoleListForSelectQuery();
  const [getRoleById] = useGetRoleByIDMutation();

  const [update, { isLoading, isError, isSuccess }] =
    useUpdateRoleAccessMutation();
  const {
    handleSubmit,
    handleChange: handleChangeFormik,
    values,
    setValues,
  } = useFormik<RoleDetails[]>({
    initialValues: [],
    onSubmit(values) {
      const data = {
        access: values,
      };
      update(data as UpdateRoleAccessRequestBody);
    },
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleChangeFormik(e);
    const index = Number(
      e.target?.name
        .toString()
        .substring(0, e.target.name.indexOf("]") + 1)
        .replace(/[\[|\]]+/g, "")
    );

    const name = e.target.name
      .toString()
      .substring(e.target.name.indexOf("]") + 1);
    let valuesIndex = 0;
    const row = values.find((item, i) => {
      if (item?.role?.id === state?.tab) {
        valuesIndex = i;
        return true;
      } else return false;
    });
    const newRow = row?.access?.map((value: any, i) =>
      i === index
        ? {
            ...value,
            [name]: e.target.checked,
          }
        : value
    );
    let newValues = values;
    newValues = newValues.map((item, index) => {
      if (index === valuesIndex) {
        return { ...item, access: newRow };
      } else {
        return item;
      }
    });
    onChange && onChange(newValues);
    setValues([...newValues]);
  };

  const columns = useMemo<GridColumns<AccessItem>>(() => {
    return [
      {
        flex: 2,
        field: "displayName",
        sortable: true,
        filterable: true,
        headerName: "Название раздела",
      },
      {
        ...gridColumnProps,
        field: "a1",
        headerName: "a1",
        renderCell: (params) => {
          const row = values.find((item) => item.role?.id === state?.tab);
          const index = row?.access?.findIndex(
            (item) => item?.interfaceId === params.id
          );
          return (
            <Checkbox
              title={params.row.a1_Title}
              disabled={disabled}
              name={`[${index}]a1`}
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
          const row = values.find((item) => item.role?.id === state?.tab);
          const index = row?.access?.findIndex(
            (item) => item?.interfaceId === params.id
          );
          return (
            <Checkbox
              title={params.row.a2_Title}
              disabled={disabled}
              name={`[${index}]a2`}
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
          const row = values.find((item) => item.role?.id === state?.tab);
          const index = row?.access?.findIndex(
            (item) => item?.interfaceId === params.id
          );
          return (
            <Checkbox
              title={params.row.a3_Title}
              disabled={disabled}
              name={`[${index}]a3`}
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
          const row = values.find((item) => item.role?.id === state?.tab);
          const index = row?.access?.findIndex(
            (item) => item?.interfaceId === params.id
          );
          return (
            <Checkbox
              title={params.row.a4_Title}
              disabled={disabled}
              name={`[${index}]a4`}
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
          const row = values.find((item) => item.role?.id === state?.tab);
          const index = row?.access?.findIndex(
            (item) => item?.interfaceId === params.id
          );
          return (
            <Checkbox
              title={params.row.a5_Title}
              disabled={disabled}
              name={`[${index}]a5`}
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
          const row = values.find((item) => item.role?.id === state?.tab);
          const index = row?.access?.findIndex(
            (item) => item?.interfaceId === params.id
          );
          return (
            <Checkbox
              title={params.row.a6_Title}
              disabled={disabled}
              name={`[${index}]a6`}
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
          const row = values.find((item) => item.role?.id === state?.tab);
          const index = row?.access?.findIndex(
            (item) => item?.interfaceId === params.id
          );
          return (
            <Checkbox
              title={params.row.a7_Title}
              disabled={disabled}
              name={`[${index}]a7`}
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
          const row = values.find((item) => item.role?.id === state?.tab);
          const index = row?.access?.findIndex(
            (item) => item?.interfaceId === params.id
          );
          return (
            <Checkbox
              title={params.row.a8_Title}
              disabled={disabled}
              name={`[${index}]a8`}
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
          const row = values.find((item) => item.role?.id === state?.tab);
          const index = row?.access?.findIndex(
            (item) => item?.interfaceId === params.id
          );
          return (
            <Checkbox
              title={params.row.a9_Title}
              disabled={disabled}
              name={`[${index}]a9`}
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
          const row = values.find((item) => item.role?.id === state?.tab);
          const index = row?.access?.findIndex(
            (item) => item?.interfaceId === params.id
          );
          return (
            <Checkbox
              title={params.row.a10_Title}
              disabled={disabled}
              name={`[${index}]a10`}
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
          const row = values.find((item) => item.role?.id === state?.tab);
          const index = row?.access?.findIndex(
            (item) => item?.interfaceId === params.id
          );
          return (
            <Checkbox
              title={params.row.a11_Title}
              disabled={disabled}
              name={`[${index}]a11`}
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
          const row = values.find((item) => item.role?.id === state?.tab);
          const index = row?.access?.findIndex(
            (item) => item?.interfaceId === params.id
          );
          return (
            <Checkbox
              title={params.row.a12_Title}
              disabled={disabled}
              name={`[${index}]a12`}
              checked={params.row.a12}
              onChange={handleChange}
            />
          );
        },
      },
    ];
  }, [handleChange, values]);
  const handleDeleteAccess = () => {
    const newRow =
      !!currentItems &&
      currentItems.filter(
        (item) => !selectedRows.includes(item.interfaceId as number)
      );
    const newValues = values.map((item) => {
      if (item.role?.id === state.tab) {
        return { ...item, access: newRow };
      } else {
        return item;
      }
    });

    setValues(newValues as RoleDetails[]);
    onChange && onChange(newValues);
  };

  const handleModalComplete = (modalValues: any) => {
    let newValues = values.map((item) => {
      if (item.role?.id === state.tab) {
        if (item.access) {
          return { ...item, access: [...item.access, ...modalValues] };
        } else {
          return { ...item, access: modalValues };
        }
      }
      return item;
    }) as typeof values;
    setValues(newValues);
    onChange && onChange(newValues);
  };

  const updateAccess = (val: RoleList) => {
    setState((prev: any) => ({
      ...prev,
      selected: val,
    }));
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
    }
  }, [isError, isSuccess]);

  const handleAddTab = () => {
    if (!values?.some((item) => item.role?.id === state.selected?.id)) {
      const newValues = [
        ...values,
        {
          access: state?.selected?.access,
          role: {
            id: state?.selected?.id,
            roleName: state?.selected?.roleName,
          },
        },
      ] as RoleDetails[];
      setState((prev) => ({
        ...prev,
        tab: newValues[newValues.length - 1].role?.id,
      }));
      setValues(newValues);
      onChange && onChange(newValues);

      getRoleById(state.selected?.id).then((res) => {
        if ("data" in res) {
          const details = res.data;
          const items = formik?.values.modulAccess.items || [];
          formik?.setFieldValue("modulAccess.items", [
            ...items,
            ...(details.modulAccess.map((item) => ({
              ...item,
              id: Math.random().toString(26),
            })) || []),
          ]);
        }
      });
    }
  };

  const handleTabChange = (event: Event, value: string | number) => {
    setState((prev: StateProps) => ({
      ...prev,
      tab: value,
    }));
  };

  const handleDeleteTab = (tab: any) => {
    let t =
      state.tab === tab.role?.id
        ? values[values.length - 2]?.role?.id
        : state.tab;
    const newValues = values.filter((item) => item.role?.id !== tab?.role?.id);
    setValues(newValues);
    onChange && onChange(newValues);
    setState((prev) => ({ selected: prev.selected, tab: t }));
  };

  const currentItems = useMemo(() => {
    return values.find((tab: any) => tab?.role?.id === state.tab)?.access;
  }, [values, state.tab]);

  return (
    <Fragment>
      <Divider textAlign="left">Доступы и права</Divider>
      <Autocomplete
        sx={{ width: "100" }}
        options={roles?.items as RoleList[]}
        renderInput={(params) => (
          <TextField {...params} name="roles" label="Раздел" />
        )}
        getOptionLabel={(option: RoleList) => option?.roleName}
        onChange={(event, value: any) => {
          updateAccess(value);
        }}
      />
      <div className="tw-flex tw-my-5">
        <Tabs value={state.tab} onChange={handleTabChange}>
          {!!values &&
            values.map((tab: any) => (
              <Tab
                label={tab.role?.roleName}
                value={tab?.role?.id}
                key={tab?.role?.id}
                component={(props: any) => (
                  <div>
                    <div {...props}></div>
                    <IconButton onClick={() => handleDeleteTab(tab)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </div>
                )}
              />
            ))}
        </Tabs>
        <Button
          sx={{ marginLeft: !!values.length ? 2 : 0 }}
          endIcon={<AddIcon />}
          variant="outlined"
          color="success"
          onClick={handleAddTab}
          disabled={!state.selected}
        >
          Добавить
        </Button>
      </div>
      {state.tab && (
        <div className="tw-flex tw-justify-center tw-gap-2 tw-">
          <div
            onClick={() => setModuleAccess(false)}
            className={`tw-min-w-[150px] tw-py-2 tw-px-3 tw-rounded-xl tw-cursor-pointer ${
              !moduleAccess
                ? "tw-bg-primary tw-text-white"
                : "tw-bg-white tw-text-primary"
            }`}
          >
            Доступ по разделам
          </div>
          <div
            onClick={() => setModuleAccess(true)}
            className={`tw-min-w-[150px] tw-py-2 tw-px-3 tw-rounded-xl tw-cursor-pointer ${
              moduleAccess
                ? "tw-bg-primary tw-text-white"
                : "tw-bg-white tw-text-primary"
            }`}
          >
            Доступ по модулям
          </div>
        </div>
      )}

      {moduleAccess
        ? state.tab && (
            <div>
              <Divider textAlign="left">Доступ по модулям</Divider>
              <ModuleAccess id={0} formik={formik} />
            </div>
          )
        : state.tab && (
            <TabPanel value={state.tab} index={state.tab} noPadding={true}>
              <Divider textAlign="left">Доступ по разделам</Divider>
              <form onSubmit={handleSubmit}>
                <Stack direction="row" spacing={3} className="tw-mb-4">
                  <Add
                    access={currentItems as AccessItem[]}
                    onComplete={handleModalComplete}
                    disabled={disabled}
                  />
                  <LoadingButton
                    color="error"
                    variant="outlined"
                    loading={isLoading}
                    disabled={disabled || selectedRows.length === 0}
                    startIcon={<DeleteIcon />}
                    onClick={handleDeleteAccess}
                  >
                    Удалить
                  </LoadingButton>
                </Stack>
                <DataTable
                  getRowId={(props: any) => props.interfaceId}
                  disabled={disabled}
                  items={currentItems}
                  columns={columns}
                  totalItems={currentItems?.length}
                  selectionModel={selectedRows}
                  showCellRightBorder
                  showColumnRightBorder
                  onSelectionModelChange={setSelectedRows}
                />
              </form>
            </TabPanel>
          )}
    </Fragment>
  );
}
