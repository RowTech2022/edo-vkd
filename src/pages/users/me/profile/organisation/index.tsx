import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { toast } from "react-toastify";
import fileService from "@services/fileService";
import { LoadingButton } from "@mui/lab";
import {
  ImageBodyRequest,
  useSaveImageMutation,
} from "@services/organizationsApi";
import { useFetchUserDetailsQuery } from "@services/admin/userProfileApi";
import { Link, useNavigate } from "react-router-dom";
import { useSession } from "@hooks";

ChartJS.register(ArcElement, Tooltip, Legend);

export const chartData = {
  labels: ["Прибыль", "Расход", ""],
  datasets: [
    {
      label: "Процент ",
      data: [12, 19, 3],
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
      ],
      borderWidth: 1,
    },
  ],
};

export const AdminProfileOrganizationPage = () => {
  const navigate = useNavigate();
  const { status } = useSession();
  const [fileLoading, setFileLoading] = useState(false);

  const [saveOrgAvatar, { isError, isLoading, isSuccess }] =
    useSaveImageMutation();
  const { data: details, isFetching } = useFetchUserDetailsQuery();

  const handleUploadFile = async (idx: number, event: HTMLInputElement) => {
    setFileLoading(true);
    const filesFormats = [".png", ".jpg", ".jpeg", ".JPG", ".PNG", ".JPEG"];
    const file = event.files;

    if (!file) {
      return;
    }
    function ext(name: any) {
      return name.match(/\.([^.]+)$|$/)[1];
    }

    const isRightFormat = filesFormats.includes("." + ext(file[0].name));
    if (!isRightFormat) {
      toast(
        "Вы можете загрузить только фотографии в формате .png, .jpg, .jpeg или .gif",
        { type: "error", position: "bottom-right" }
      );
      setFileLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append(idx.toString(), file[0]);

    await fileService
      .uploadFileV2(formData)
      .then((e) => {
        let resp = e as { data: ImageBodyRequest };
        resp.data.organisationId = details?.userCompany?.id || 0;
        saveOrgAvatar(resp.data);
      })
      .finally(() => setFileLoading(false));
  };

  useEffect(() => {
    if (isError) {
      toast("Произошла ошибка. Попробуйте повторить позже.", {
        type: "error",
        position: "top-right",
      });
    }
    if (isSuccess) {
      toast("Аватарка обновлена.", {
        type: "success",
        position: "top-right",
      });
    }
  }, [isError, isSuccess]);

  useEffect(() => {
    if (status === "unauthenticated") {
      navigate("/auth/login");
    }
  }, [status]);

  if (status !== "authenticated") {
    return <></>;
  }

  return (
    <Box
      sx={{
        borderRadius: "20px",
        boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.24)",
        background: "white",
        padding: "40px",
      }}
    >
      <Box className="tw-grid tw-grid-cols-3 tw-mb-4">
        <Typography className="tw-col-span-2" fontSize="22px" color="primary">
          Подтвержденная организация
        </Typography>
      </Box>

      <Box className="tw-grid tw-grid-cols-3">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
            boxShadow: "0 0 4px 0 rgba(0, 0, 0, 0.24)",
            borderRadius: "20px",
          }}
        >
          <Box sx={{ position: "relative", paddingBottom: "40px" }}>
            {isFetching && (
              <i className="tw-absolute tw-top-1/2 tw-left-1/2 -tw-translate-x-1/2 -tw-translate-y-1/2">
                <CircularProgress />
              </i>
            )}
            <img
              style={{ width: "230px", opacity: isFetching ? "0.2" : 1 }}
              src={details?.userCompany?.logo || "/images/user-avatar.png"}
              alt="user-avatar"
            />
          </Box>

          <label htmlFor="file-upload">
            <LoadingButton
              sx={{ "&.MuiLoadingButton-root": { borderRadius: "8px" } }}
              component="span"
              endIcon={<PhotoCameraIcon />}
              loading={fileLoading || isLoading}
              loadingPosition="end"
              variant="contained"
            >
              <span>ВЫБРАТЬ ФОТО</span>
            </LoadingButton>
            <input
              id="file-upload"
              type="file"
              accept="*"
              onChange={(e) =>
                handleUploadFile(1, e.currentTarget as HTMLInputElement)
              }
              style={{ display: "none" }}
            />
          </label>
        </Box>
        <Box sx={{ margin: "0 20px" }}>
          <Typography color="primary" fontSize="16px">
            Наименование
          </Typography>
          <Typography fontSize={"14px"} marginBottom={"10px"}>
            {details?.userCompany?.name || ""}
          </Typography>
          <Typography color="primary" fontSize="16px">
            Телефон
          </Typography>
          <Typography fontSize="14px" marginBottom={"10px"}>
            {details?.userCompany?.phone}
          </Typography>
          <Typography color="primary" fontSize="16px">
            E-mail
          </Typography>
          <Typography fontSize="14px" marginBottom={"10px"}>
            {details?.userCompany?.email}
          </Typography>
          <Typography color="primary" fontSize="16px">
            ИНН
          </Typography>
          <Typography fontSize="14px" marginBottom={"10px"}>
            {details?.userCompany?.inn}
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: 3,
          mt: 6,
          mb: 1,
          "& > div": { minWidth: "180px" },
        }}
      >
        <Box>
          <Link to="/">
            <Button
              variant="contained"
              sx={{
                borderRadius: "8px",
              }}
              fullWidth
            >
              Структура организации
            </Button>
          </Link>
        </Box>
      </Box>
    </Box>
  );
};
