import {
  AccessItem,
  UpdateRoleAccessRequestBody,
  useUpdateRoleAccessMutation,
} from "@services/admin/rolesApi";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import Stack from "@mui/material/Stack";
import { useFormik } from "formik";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { Loading } from "@ui";
import Add from "./add";
import { LoadingButton } from "@mui/lab";

interface TableFormProps {
  data?: AccessItem[];
  loading: boolean;
  onSuccess: () => void;
  id?: number | string;
}

export default function TableForm({
  data = [],
  id,
  loading,
  onSuccess,
}: TableFormProps) {
  const [update, { isLoading, isError, isSuccess }] =
    useUpdateRoleAccessMutation();
  const { handleSubmit, handleChange, values, setValues } = useFormik<
    AccessItem[]
  >({
    initialValues: [],
    onSubmit(values) {
      const data = {
        id: typeof id === "string" ? parseInt(id) : id,
        access: values,
      };
      update(data as UpdateRoleAccessRequestBody);
    },
  });

  useEffect(() => {
    setValues(data);
  }, [data, setValues]);

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
      onSuccess();
    }
  }, [isError, isSuccess, onSuccess]);

  return (
    <form onSubmit={handleSubmit}>
      <Stack direction="row" spacing={3} className="tw-mb-4">
        {!!values.length && (
          <LoadingButton type="submit" variant="outlined" loading={isLoading}>
            Сохранить
          </LoadingButton>
        )}
        <Add access={data} onComplete={onSuccess} />
      </Stack>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ border: 1 }}>Название раздела</TableCell>
              <TableCell sx={{ border: 1 }} align="center">
                a1
              </TableCell>
              <TableCell sx={{ border: 1 }} align="center">
                a2
              </TableCell>
              <TableCell sx={{ border: 1 }} align="center">
                a3
              </TableCell>
              <TableCell sx={{ border: 1 }} align="center">
                a4
              </TableCell>
              <TableCell sx={{ border: 1 }} align="center">
                a5
              </TableCell>
              <TableCell sx={{ border: 1 }} align="center">
                a6
              </TableCell>
              <TableCell sx={{ border: 1 }} align="center">
                a7
              </TableCell>
              <TableCell sx={{ border: 1 }} align="center">
                a8
              </TableCell>
              <TableCell sx={{ border: 1 }} align="center">
                a9
              </TableCell>
              <TableCell sx={{ border: 1 }} align="center">
                a10
              </TableCell>
              <TableCell sx={{ border: 1 }} align="center">
                a11
              </TableCell>
              <TableCell sx={{ border: 1 }} align="center">
                a12
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell sx={{ border: 1 }} align="center" colSpan={9}>
                  <Loading />
                </TableCell>
              </TableRow>
            ) : values.length ? (
              values.map((row, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ border: 1 }}>{row.displayName}</TableCell>
                  <TableCell sx={{ border: 1 }} align="center">
                    <Checkbox
                      name={`[${index}]a1`}
                      checked={values[index].a1}
                      onChange={handleChange}
                    />
                  </TableCell>
                  <TableCell sx={{ border: 1 }} align="center">
                    <Checkbox
                      name={`[${index}]a2`}
                      checked={values[index].a2}
                      onChange={handleChange}
                    />
                  </TableCell>
                  <TableCell sx={{ border: 1 }} align="center">
                    <Checkbox
                      name={`[${index}]a3`}
                      checked={values[index].a3}
                      onChange={handleChange}
                    />
                  </TableCell>
                  <TableCell sx={{ border: 1 }} align="center">
                    <Checkbox
                      name={`[${index}]a4`}
                      checked={values[index].a4}
                      onChange={handleChange}
                    />
                  </TableCell>
                  <TableCell sx={{ border: 1 }} align="center">
                    <Checkbox
                      name={`[${index}]a5`}
                      checked={values[index].a5}
                      onChange={handleChange}
                    />
                  </TableCell>
                  <TableCell sx={{ border: 1 }} align="center">
                    <Checkbox
                      name={`[${index}]a6`}
                      checked={values[index].a6}
                      onChange={handleChange}
                    />
                  </TableCell>
                  <TableCell sx={{ border: 1 }} align="center">
                    <Checkbox
                      name={`[${index}]a7`}
                      checked={values[index].a7}
                      onChange={handleChange}
                    />
                  </TableCell>
                  <TableCell sx={{ border: 1 }} align="center">
                    <Checkbox
                      name={`[${index}]a8`}
                      checked={values[index].a8}
                      onChange={handleChange}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell sx={{ border: 1 }} align="center" colSpan={9}>
                  Список пуст
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </form>
  );
}
