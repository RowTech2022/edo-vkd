import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
} from "@mui/material";
import { CardGroup } from "@root/shared/ui/CardGroup";
import { CustomButton } from "@ui";
import { useFormik } from "formik";
import { FC, useEffect, useMemo, useState } from "react";
import { useSaveAdminOtdelMutation } from "@services/applicationsApi";
import { IExecutor, ITabDetail, TabType } from "../interface";
import { reconstructOptions, transitionsAllowed } from "../utils";
import { initialValuesAdmin } from "./schema";

const Admin: FC<ITabDetail> = (props) => {
  const { handlers, id, executors, transitions, loaderButtonId } = props;
  const { executor } = props.admin;
  const [saveAdmin] = useSaveAdminOtdelMutation();
  const [saveLoading, setSaveLoading] = useState(false);

  const formik = useFormik({
    initialValues: initialValuesAdmin,
    onSubmit: (values) => {
      setSaveLoading(true);
      saveAdmin(values)
        .then((res) => console.log(res))
        .catch((err) => console.log(err))
        .finally(() => setSaveLoading(false));
    },
  });

  const defaultVal = useMemo(() => {
    let found = executor;
    if (executors) {
      found = executors?.find((item) => executor?.id === item.id) as IExecutor;
    }
    if (!found) return null;
    return { label: found.value, id: found.id };
  }, [executors, executor]);
  const [executorState, setExecutor] = useState(defaultVal || null);
  const executorList = useMemo(
    () => reconstructOptions(executors || []),
    [executors]
  );

  const onExecutorSave = () => {
    if (executorState) {
      const executor = {
        id: executorState.id,
        value: executorState.label,
      };
      handlers.setExecutor(id, TabType.ADMIN, executor);
    }
  };

  useEffect(() => {
    formik.setValues({ ...props.admin, id: props.id });
  }, [props.admin]);

  const { admin_executor, admin_back, admin_approve, admin_complated } =
    transitions.buttonSettings || {};

  return (
    <div className="Admin">
      <Box paddingX="15px" display="flex" columnGap="20px">
        <Autocomplete<{ label: string; id: string }>
          disablePortal
          value={executorState}
          id="combo-box-demo"
          options={executorList}
          onChange={(e: any, value) => {
            if (value) {
              setExecutor(value);
              formik.setFieldValue("executor", value);
            }
          }}
          sx={{ width: 300, marginBottom: "16px" }}
          renderInput={(params) => (
            <TextField {...params} label="Исполнитель" />
          )}
        />
        <Button
          type="button"
          color="primary"
          variant="contained"
          size="medium"
          disabled={transitionsAllowed(admin_executor?.readOnly)}
          onClick={onExecutorSave}
          sx={{ fontWeight: 600, minWidth: "100px", height: "56px" }}
        >
          Сохранить
        </Button>
      </Box>
      <Box display="flex" columnGap="40px">
        <Box maxWidth="600px">
          <CardGroup title="Отключения">
            <Box display="flex" columnGap="15px">
              <Button
                disabled
                type="button"
                color="primary"
                variant="contained"
                size="medium"
                onClick={() => {}}
                sx={{ fontWeight: 600, minWidth: "100px" }}
              >
                VPN
              </Button>
              <TextField
                value={formik.values.loginVpn}
                onChange={(event) =>
                  formik.setFieldValue("loginVpn", event.target.value)
                }
                id="outlined-basic"
                label="Login"
                variant="outlined"
              />
              <FormControlLabel
                control={<Checkbox defaultChecked />}
                label="Пассив"
                checked={formik.values.passiveLoginVpn}
                onChange={(event, checked) =>
                  formik.setFieldValue("passiveLoginVpn", checked)
                }
              />
            </Box>
          </CardGroup>
          <CardGroup title="Регистрация">
            <Box display="flex" columnGap="15px">
              <Button
                disabled
                type="button"
                color="primary"
                variant="contained"
                size="medium"
                onClick={() => {}}
                sx={{ fontWeight: 600, minWidth: "100px" }}
              >
                VPN
              </Button>
              <TextField
                value={formik.values.newVpnLogin}
                onChange={(event) =>
                  formik.setFieldValue("newVpnLogin", event.target.value)
                }
                id="outlined-basic"
                label="Login"
                variant="outlined"
              />
              <TextField
                value={formik.values.newVpnPassword}
                onChange={(event) =>
                  formik.setFieldValue("newVpnPassword", event.target.value)
                }
                id="outlined-basic"
                label="Пароль"
                variant="outlined"
                type="password"
              />
            </Box>
          </CardGroup>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          columnGap: "20px",
          marginBottom: "32px",
          justifyContent: "end",
          height: "44px",
        }}
      >
        <CustomButton
          withRuToken
          type="button"
          color="primary"
          variant="contained"
          size="medium"
          loading={saveLoading}
          onClick={() => {
            handlers.modifyRequest("setApprove", props.id, TabType.IB1);
            formik.submitForm();
          }}
          sx={{ fontWeight: 600, minWidth: "100px" }}
        >
          Сохранить
        </CustomButton>
        <CustomButton
          type="button"
          color="success"
          variant="contained"
          size="medium"
          loading={"admin_complated" === loaderButtonId}
          disabled={transitionsAllowed(admin_complated?.readOnly)}
          onClick={() =>
            handlers.modifyRequest(
              "setComplated",
              props.id,
              TabType.ADMIN,
              "admin_complated"
            )
          }
          sx={{ fontWeight: 600, minWidth: "100px" }}
        >
          Выполненно
        </CustomButton>
        <CustomButton
          type="button"
          color="error"
          variant="contained"
          size="medium"
          loading={"admin_back" === loaderButtonId}
          disabled={transitionsAllowed(admin_back?.readOnly)}
          onClick={() =>
            handlers.modifyRequest(
              "setBack",
              props.id,
              TabType.ADMIN,
              "admin_back"
            )
          }
          sx={{ fontWeight: 600, minWidth: "100px" }}
        >
          Вернуть
        </CustomButton>
        <CustomButton
          withRuToken
          type="button"
          color="info"
          variant="contained"
          size="medium"
          loading={"admin_approve" === loaderButtonId}
          disabled={transitionsAllowed(admin_approve?.readOnly)}
          onClick={() =>
            handlers.modifyRequest(
              "setApprove",
              props.id,
              TabType.ADMIN,
              "admin_approve"
            )
          }
          sx={{ fontWeight: 600, minWidth: "100px" }}
        >
          Утвердить
        </CustomButton>
      </Box>
    </div>
  );
};

export default Admin;
