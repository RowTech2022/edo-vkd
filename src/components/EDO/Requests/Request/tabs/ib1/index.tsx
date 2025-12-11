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
import {
  IApplicationByIdResponse,
  useSaveIbOtdel1Mutation,
} from "@services/applicationsApi";
import { IExecutor, ITabDetail, TabType } from "../interface";
import { reconstructOptions, transitionsAllowed } from "../utils";
import { initialValuesIb } from "./schema";

const IB1: FC<ITabDetail> = (props) => {
  const { handlers, id, executors, transitions, loaderButtonId } = props;
  const { executor } = props.ib;

  const [saveIbOtdel] = useSaveIbOtdel1Mutation();

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
  const [saveLoading, setSaveLoading] = useState(false);

  const formik = useFormik<IApplicationByIdResponse["ib"]>({
    initialValues: initialValuesIb,
    onSubmit: (values) => {
      setSaveLoading(true);
      saveIbOtdel(values)
        .then((res) => console.log(res))
        .catch((err) => console.log(err))
        .finally(() => setSaveLoading(false));
    },
  });

  useEffect(() => {
    const data = { ...props.ib };
    data.id = props.id;
    formik.setValues(data);
  }, [props.ib]);

  const onExecutorSave = () => {
    if (executorState) {
      const executor = {
        id: executorState.id,
        value: executorState.label,
      };
      handlers.setExecutor(id, TabType.IB1, executor);
    }
  };

  const { ib1_executor, ib1_back, ib1_approve, ib1_complated } =
    transitions.buttonSettings || {};

  return (
    <div className="IB1">
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
        <CustomButton
          type="button"
          color="primary"
          variant="contained"
          size="medium"
          disabled={transitionsAllowed(ib1_executor?.readOnly)}
          onClick={onExecutorSave}
          sx={{ fontWeight: 600, minWidth: "100px", height: "56px" }}
        >
          Сохранить
        </CustomButton>
      </Box>
      <Box maxWidth="600px">
        <CardGroup title="Отключения">
          <Box display="flex" columnGap="15px" marginBottom="15px">
            <Button
              disabled
              type="button"
              color="primary"
              variant="contained"
              size="medium"
              onClick={() => {}}
              sx={{ fontWeight: 600, minWidth: "100px" }}
            >
              TFMIS
            </Button>
            <TextField
              value={formik.values.loginTfmis}
              onChange={(event) =>
                formik.setFieldValue("loginTfmis", event.target.value)
              }
              id="outlined-basic"
              label="Login"
              variant="outlined"
            />
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Пассив"
              checked={formik.values.passiveLoginTfmis}
              onChange={(event, checked) =>
                formik.setFieldValue("passiveLoginTfmis", checked)
              }
            />
          </Box>
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
              EDO
            </Button>
            <TextField
              value={formik.values.loginEdo}
              onChange={(event) =>
                formik.setFieldValue("loginEdo", event.target.value)
              }
              id="outlined-basic"
              label="Login"
              variant="outlined"
            />
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Пассив"
              checked={formik.values.passiveLoginEdo}
              onChange={(event, checked) =>
                formik.setFieldValue("passiveLoginEdo", checked)
              }
            />
          </Box>
        </CardGroup>
      </Box>

      <Box sx={{ display: "flex", columngGap: "40px", alignItems: "end" }}>
        <Box maxWidth="600px">
          <CardGroup title="Регистрация">
            <Box display="flex" columnGap="15px" marginBottom="15px">
              <Button
                disabled
                type="button"
                color="warning"
                variant="contained"
                size="medium"
                onClick={() => {}}
                sx={{ fontWeight: 600, minWidth: "100px" }}
              >
                TFMIS
              </Button>
              <TextField
                value={formik.values.newTfmisLogin}
                onChange={(event) =>
                  formik.setFieldValue("newTfmisLogin", event.target.value)
                }
                id="outlined-basic"
                label="Login"
                variant="outlined"
              />
              <TextField
                value={formik.values.newTfmisPassword}
                onChange={(event) =>
                  formik.setFieldValue("newTfmisPassword", event.target.value)
                }
                id="outlined-basic"
                label="Пароль"
                variant="outlined"
                type="password"
              />
            </Box>
            <Box display="flex" columnGap="15px">
              <Button
                disabled
                type="button"
                color="warning"
                variant="contained"
                size="medium"
                onClick={() => {}}
                sx={{ fontWeight: 600, minWidth: "100px" }}
              >
                EDO
              </Button>
              <TextField
                value={formik.values.newEdoLogin}
                onChange={(event) =>
                  formik.setFieldValue("newEdoLogin", event.target.value)
                }
                id="outlined-basic"
                label="Login"
                variant="outlined"
              />
              <TextField
                value={formik.values.newEdoPassword}
                onChange={(event) =>
                  formik.setFieldValue("newEdoPassword", event.target.value)
                }
                id="outlined-basic"
                label="Пароль"
                variant="outlined"
                type="password"
              />
            </Box>
          </CardGroup>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "end",
            flexGrow: 1,
            columnGap: "20px",
            marginBottom: "32px",
            height: "44px",
          }}
        >
          <CustomButton
            type="button"
            color="primary"
            variant="contained"
            size="medium"
            loading={saveLoading}
            onClick={() => {
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
            loading={"ib1_complated" === loaderButtonId}
            size="medium"
            disabled={transitionsAllowed(ib1_complated?.readOnly)}
            onClick={() =>
              handlers.modifyRequest(
                "setComplated",
                props.id,
                TabType.IB1,
                "ib1_complated"
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
            loading={"ib1_back" === loaderButtonId}
            disabled={transitionsAllowed(ib1_back?.readOnly)}
            onClick={() =>
              handlers.modifyRequest(
                "setBack",
                props.id,
                TabType.IB1,
                "ib1_back"
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
            loading={"ib1_approve" === loaderButtonId}
            size="medium"
            disabled={transitionsAllowed(ib1_approve?.readOnly)}
            onClick={() =>
              handlers.modifyRequest(
                "setApprove",
                props.id,
                TabType.IB1,
                "ib1_approve"
              )
            }
            sx={{ fontWeight: 600, minWidth: "100px" }}
          >
            Утвердить
          </CustomButton>
        </Box>
      </Box>
    </div>
  );
};

export default IB1;
