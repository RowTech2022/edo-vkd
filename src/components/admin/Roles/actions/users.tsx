import { Loading } from "@ui";
import {
  useFetchUsersByRoleIdMutation,
  UserByRoleIdResponse,
} from "@services/admin/rolesApi";
import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify/dist";

interface IProps {
  id: number;
}

export default function Users({ id }: IProps) {
  const [users, setUsers] = useState<UserByRoleIdResponse[]>([]);

  const [getUsersByRoleId, { isLoading }] = useFetchUsersByRoleIdMutation();

  useEffect(() => {
    if (id)
      getUsersByRoleId({ id })
        .then((res) => {
          if ("data" in res) {
            const users = res.data;
            setUsers(users);
          }
        })
        .catch((e) =>
          toast.error("Произошла ошибка при получении пользователей")
        );
  }, [id]);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : users.length > 0 ? (
        users.map((item, index) => (
          <Box key={item.id} sx={{ display: "flex", gap: 3, mb: 2 }}>
            <Typography>{index + 1}.</Typography>
            <Typography>{item.userName}</Typography>
            <Typography sx={{ color: "primary.main" }}>{item.phone}</Typography>
          </Box>
        ))
      ) : (
        <Typography>Пользователей не найдено</Typography>
      )}
    </>
  );
}
