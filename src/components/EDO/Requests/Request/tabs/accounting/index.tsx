import { Autocomplete, Box, Button, TextField } from "@mui/material";
import { CustomButton, CardGroup } from "@ui";
import { FieldArray, Formik } from "formik";
import { FC, useEffect, useMemo, useState } from "react";
import { useSaveAccountantOtdelMutation } from "@services/applicationsApi";
import { IExecutor, ITabDetail, TabType } from "../interface";
import { reconstructOptions, transitionsAllowed } from "../utils";
import { initialValuesAccountant } from "./schema";

type AccountantKeys = "invoices" | "waybills" | "acts";

const Accounting: FC<ITabDetail> = (props) => {
  const { handlers, id, executors, transitions, loaderButtonId } = props;
  const { executor } = props.accountant;

  const [saveAccountant] = useSaveAccountantOtdelMutation();

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

  const onExecutorSave = () => {
    if (executorState) {
      const executor = {
        id: executorState.id,
        value: executorState.label,
      };
      handlers.setExecutor(id, TabType.ACCOUNTANT, executor);
    }
  };

  useEffect(() => {
    const data = { ...props.accountant, id: props.id };
    const keys: AccountantKeys[] = ["invoices", "waybills", "acts"];
    keys.forEach((item) => {
      if (!data[item]) {
        data[item] = [];
      }
    });
  }, [props.accountant]);

  const {
    accountant_executor,
    accountant_back,
    accountant_approve,
    accountant_complated,
  } = (transitions.buttonSettings || {}) as any;

  const data = { ...props.accountant, id: props.id };
  const keys: AccountantKeys[] = ["invoices", "waybills", "acts"];
  keys.forEach((item) => {
    if (!data[item]) {
      data[item] = [];
    }
  });

  return (
    <Formik
      initialValues={data || initialValuesAccountant}
      onSubmit={(values) => {
        setSaveLoading(true);
        saveAccountant(values)
          .then(console.log)
          .catch(console.log)
          .finally(() => setSaveLoading(false));
      }}
    >
      {(formik) => (
        <div className="Accounting">
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
              disabled={transitionsAllowed(accountant_executor?.readOnly)}
              onClick={onExecutorSave}
              sx={{ fontWeight: 600, minWidth: "100px", height: "56px" }}
            >
              Сохранить
            </Button>
          </Box>
          <Box display="flex" columnGap="40px">
            <Box minWidth="400px">
              <CardGroup title="Счета">
                <FieldArray
                  name="invoices"
                  validateOnChange={false}
                  render={(arrayHelpers) => (
                    <>
                      <Box
                        display="flex"
                        flexDirection="column"
                        rowGap="15px"
                        marginBottom="15px"
                      >
                        {formik.values.invoices &&
                          formik.values.invoices.map((item, idx) => (
                            <TextField
                              key={"item_" + idx}
                              value={item}
                              onChange={(event) => {
                                formik.values.invoices[idx] =
                                  event.target.value;
                                formik.setFieldValue(
                                  "invoices",
                                  formik.values.invoices
                                );
                              }}
                              name={`invoices.${idx}`}
                              id="outlined-basic"
                              label={"№" + (idx + 1)}
                              variant="outlined"
                            />
                          ))}
                      </Box>
                      <Button
                        type="button"
                        color="primary"
                        variant="contained"
                        size="medium"
                        onClick={() => {
                          arrayHelpers.push("");
                        }}
                        sx={{ fontWeight: 600, minWidth: "100px" }}
                      >
                        Добавить
                      </Button>
                    </>
                  )}
                />
              </CardGroup>
            </Box>

            <Box minWidth="400px">
              <CardGroup title="Акт сверки">
                <FieldArray
                  name="acts"
                  validateOnChange={false}
                  render={(arrayHelpers) => (
                    <>
                      <Box
                        display="flex"
                        flexDirection="column"
                        rowGap="15px"
                        marginBottom="15px"
                      >
                        {formik.values.acts &&
                          formik.values.acts.map((item, idx) => (
                            <TextField
                              key={"item_" + idx}
                              value={item}
                              name={`acts.${idx}`}
                              onChange={(event) => {
                                formik.values.acts[idx] = event.target.value;
                                formik.setFieldValue(
                                  "acts",
                                  formik.values.acts
                                );
                              }}
                              id="outlined-basic"
                              label={"№" + (idx + 1)}
                              variant="outlined"
                            />
                          ))}
                      </Box>
                      <Button
                        type="button"
                        color="primary"
                        variant="contained"
                        size="medium"
                        onClick={() => {
                          arrayHelpers.push("");
                        }}
                        sx={{ fontWeight: 600, minWidth: "100px" }}
                      >
                        Добавить
                      </Button>
                    </>
                  )}
                />
              </CardGroup>
            </Box>

            <Box minWidth="400px">
              <CardGroup title="Накладные">
                <FieldArray
                  name="waybills"
                  validateOnChange={false}
                  render={(arrayHelpers) => (
                    <>
                      <Box
                        display="flex"
                        flexDirection="column"
                        rowGap="15px"
                        marginBottom="15px"
                      >
                        {formik.values.waybills &&
                          formik.values.waybills.map((item, idx) => (
                            <TextField
                              key={"item_" + idx}
                              value={item}
                              onChange={(event) => {
                                formik.values.waybills[idx] =
                                  event.target.value;
                                formik.setFieldValue(
                                  "waybills",
                                  formik.values.waybills
                                );
                              }}
                              id="outlined-basic"
                              label={"№" + (idx + 1)}
                              variant="outlined"
                            />
                          ))}
                      </Box>
                      <Button
                        type="button"
                        color="primary"
                        variant="contained"
                        size="medium"
                        onClick={() => {
                          arrayHelpers.push("");
                        }}
                        sx={{ fontWeight: 600, minWidth: "100px" }}
                      >
                        Добавить
                      </Button>
                    </>
                  )}
                />
              </CardGroup>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "end",
              columnGap: "20px",
              marginTop: "20px",
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
              onClick={() => formik.submitForm()}
              sx={{ fontWeight: 600, minWidth: "100px" }}
            >
              Сохранить
            </CustomButton>
            <CustomButton
              type="button"
              color="success"
              variant="contained"
              size="medium"
              loading={"accountant_complated" === loaderButtonId}
              disabled={transitionsAllowed(accountant_complated?.readOnly)}
              onClick={() =>
                handlers.modifyRequest(
                  "setComplated",
                  props.id,
                  TabType.ACCOUNTANT,
                  "accountant_complated"
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
              loading={"accountant_back" === loaderButtonId}
              disabled={transitionsAllowed(accountant_back?.readOnly)}
              onClick={() =>
                handlers.modifyRequest(
                  "setBack",
                  props.id,
                  TabType.ACCOUNTANT,
                  "accountant_back"
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
              loading={"accountant_approve" === loaderButtonId}
              disabled={transitionsAllowed(accountant_approve?.readOnly)}
              onClick={() =>
                handlers.modifyRequest(
                  "setApprove",
                  props.id,
                  TabType.ACCOUNTANT,
                  "accountant_approve"
                )
              }
              sx={{ fontWeight: 600, minWidth: "100px" }}
            >
              Утвердить
            </CustomButton>
          </Box>
        </div>
      )}
    </Formik>
  );
};

export default Accounting;
