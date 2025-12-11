import { Autocomplete, Box, Button, TextField } from "@mui/material";
import { CardGroup } from "@root/shared/ui/CardGroup";
import { CustomButton } from "@ui";
import { useFormik } from "formik";
import { FC, useEffect, useMemo, useState } from "react";
import { useSaveIbOtdel2Mutation } from "@services/applicationsApi";
import { IExecutor, ITabDetail, TabType } from "../interface";
import { reconstructOptions, transitionsAllowed } from "../utils";
import { initialValuesIb2 } from "./schema";

const IB2: FC<ITabDetail> = (props) => {
  const { handlers, id, executors, transitions, loaderButtonId } = props;
  const { executor } = props.ib2;
  const [saveIb2Otdel] = useSaveIbOtdel2Mutation();

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

  const formik = useFormik({
    initialValues: initialValuesIb2,
    onSubmit: (values) => {
      setSaveLoading(true);
      saveIb2Otdel(values)
        .then((res) => console.log(res))
        .catch((err) => console.log(err))
        .finally(() => setSaveLoading(false));
    },
  });

  const onExecutorSave = () => {
    if (executorState) {
      const executor = {
        id: executorState.id,
        value: executorState.label,
      };
      handlers.setExecutor(id, TabType.IB2, executor);
    }
  };

  useEffect(() => {
    formik.setValues({ ...props.ib2, id: props.id });
  }, [props.ib2]);

  const { ib2_executor, ib2_back, ib2_approve, ib2_complated } =
    transitions.buttonSettings || {};

  return (
    <div className="IB2">
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
          disabled={transitionsAllowed(ib2_executor?.readOnly)}
          onClick={onExecutorSave}
          sx={{ fontWeight: 600, minWidth: "100px", height: "56px" }}
        >
          Сохранить
        </Button>
      </Box>

      <Box sx={{ display: "flex", columngGap: "40px", alignItems: "end" }}>
        <Box maxWidth="600px">
          <CardGroup title="Привязка серт">
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
                value={formik.values.loginTfmis}
                onChange={(event) =>
                  formik.setFieldValue("loginTfmis", event.target.value)
                }
                id="outlined-basic"
                label="Login"
                variant="outlined"
              />
              <TextField
                value={formik.values.tfmisCert}
                onChange={(event) =>
                  formik.setFieldValue("tfmisCert", event.target.value)
                }
                id="outlined-basic"
                label="Серия"
                variant="outlined"
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
                value={formik.values.loginEdo}
                onChange={(event) =>
                  formik.setFieldValue("loginEdo", event.target.value)
                }
                id="outlined-basic"
                label="Login"
                variant="outlined"
              />
              <TextField
                value={formik.values.edoCert}
                onChange={(event) =>
                  formik.setFieldValue("edoCert", event.target.value)
                }
                id="outlined-basic"
                label="Серия"
                variant="outlined"
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
            withRuToken
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
            size="medium"
            loading={"ib2_complated" === loaderButtonId}
            disabled={transitionsAllowed(ib2_complated?.readOnly)}
            onClick={() =>
              handlers.modifyRequest(
                "setComplated",
                props.id,
                TabType.IB2,
                "ib2_complated"
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
            loading={"ib2_back" === loaderButtonId}
            disabled={transitionsAllowed(ib2_back?.readOnly)}
            onClick={() =>
              handlers.modifyRequest(
                "setBack",
                props.id,
                TabType.IB2,
                "ib2_back"
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
            disabled={transitionsAllowed(ib2_approve?.readOnly)}
            onClick={() =>
              handlers.modifyRequest("setApprove", props.id, TabType.IB2)
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

export default IB2;
