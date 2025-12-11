import { FC, useEffect } from "react";
import { Modal } from "@ui";
import { useFormik } from "formik";
import { Autocomplete, Button, debounce, TextField } from "@mui/material";
import { getFieldErrors, toastPromise } from "@utils";
import { useGetAvailableUserMutation } from "@services/userprofileApi";
import {
  useCreateFolderV4Mutation,
  useCreateOutcomingFolderLettersV4Mutation,
  useLazyFetchFolderByIdOutcomingV4Query,
  useLazyFetchFolderByIdQuery,
  useUpdateFolderV4Mutation,
} from "@services/lettersApiV4";
import { LoadingButton } from "@mui/lab";
import * as Yup from "yup";

interface IProps {
  open?: boolean;
  onClose: () => void;
  refetchFolders: () => void;
  folderId?: number;
  isIncoming?: boolean;
}

const schema = Yup.object({
  name: Yup.string().required("Обязательное поле"),
  prefix: Yup.string().required("Обязательное поле"),
});

export const AddFolderModal: FC<IProps> = ({
  open,
  onClose,
  refetchFolders,
  folderId,
  isIncoming,
}) => {
  const [getAvailableUsers, { data }] = useGetAvailableUserMutation();

  const [createFolder, { isLoading }] = useCreateFolderV4Mutation();
  const [createFolderOutcoming, { isLoading: isLoadingOutcoming }] =
    useCreateOutcomingFolderLettersV4Mutation();

  const [updateFolder] = useUpdateFolderV4Mutation();

  const [fetchFolderById, { data: folderData }] = useLazyFetchFolderByIdQuery();
  const [fetchFolderByIdOutcoming, { data: folderDataOutcoming }] =
    useLazyFetchFolderByIdOutcomingV4Query();

  const formik = useFormik<any>({
    initialValues: {
      name: "",
      prefix: "",
      userIds: [],
    },
    validationSchema: schema,
    onSubmit(values) {
      if (folderId) {
        const promise = updateFolder({
          id: folderId,
          ...values,
          userIds: values.userIds?.map((item) => item.id) ?? [],
        }).then(() => {
          onClose();
          refetchFolders();
        });

        toastPromise(promise, {
          pending: `Папка ${values.name} обновляется`,
          error: "Произошло ошибка",
          success: `Папка ${values.name} успешно обновлена`,
        });

        return;
      }

      const createRequest = isIncoming ? createFolder : createFolderOutcoming;

      const promise = createRequest({
        ...values,
        userIds: values.userIds?.map((item) => item.id) ?? [],
      }).then(() => {
        onClose();
        refetchFolders();
      });

      toastPromise(promise, {
        pending: `Папка ${values.name} создается`,
        error: "Произошло ошибка",
        success: `Папка ${values.name} успешно создана`,
      });
    },
  });

  const { handleSubmit, handleChange, values, errors, setFieldValue } = formik;

  const debounceSearch = debounce((value) => getAvailableUsers(value), 400);

  useEffect(() => {
    getAvailableUsers("");
  }, []);

  useEffect(() => {
    if (folderId) {
      isIncoming
        ? fetchFolderById(folderId)
        : fetchFolderByIdOutcoming(folderId);
    }
  }, [folderId, isIncoming]);

  useEffect(() => {
    const data = isIncoming ? folderData : folderDataOutcoming;
    if (data) {
      formik.setValues({
        name: data.name,
        prefix: data.prefix,
        userIds: data.users || [],
      });
    }
  }, [folderData, folderDataOutcoming, isIncoming]);

  return (
    <Modal open={open} setOpen={onClose}>
      <form onSubmit={handleSubmit}>
        <h4 className="tw-text-2xl tw-mb-4">
          {folderId ? "Редактирование" : "Создание"} папки
        </h4>
        <div className="tw-flex tw-flex-col tw-gap-3 tw-w-[500px]">
          <div className="tw-flex tw-gap-3">
            <TextField
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
              size="small"
              name="name"
              label="Название папки"
              value={values.name}
              autoFocus
              fullWidth
              onChange={handleChange}
              {...getFieldErrors(formik, "name")}
            />
            <TextField
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
              size="small"
              name="prefix"
              label="Префикс"
              value={values.prefix}
              fullWidth
              onChange={handleChange}
              {...getFieldErrors(formik, "prefix")}
            />
          </div>
          <Autocomplete
            options={data?.items || []}
            getOptionLabel={(option: any) => option.value as string}
            size="medium"
            noOptionsText="Нет данных"
            isOptionEqualToValue={(option: any, value: any) =>
              option.id === value.id
            }
            value={values.userIds}
            onChange={(event, value) => {
              setFieldValue("userIds", value);
            }}
            multiple
            onInputChange={(e, value) => debounceSearch(value)}
            renderInput={(params) => (
              <TextField
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                {...params}
                name={"userIds"}
                label={"Пользователи"}
              />
            )}
          />
        </div>

        <div className="tw-flex tw-justify-end tw-gap-3 tw-pt-6">
          <Button onClick={onClose}>Отмена</Button>
          <LoadingButton
            loading={isLoading}
            type="submit"
            sx={{ borderRadius: "8px" }}
            variant="contained"
          >
            {folderId ? "Сохранить" : "Создать"}
          </LoadingButton>
        </div>
      </form>
    </Modal>
  );
};
