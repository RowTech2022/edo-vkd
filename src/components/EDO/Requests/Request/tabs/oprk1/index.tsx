import { Autocomplete, Box, Button, TextField } from "@mui/material";
import { CardGroup } from "@root/shared/ui/CardGroup";
import { CustomButton } from "@ui";
import { useFormik } from "formik";
import { FC, useEffect, useMemo, useState } from "react";
import { useSaveOprk1Mutation } from "@services/applicationsApi";
import { IExecutor, ITabDetail, TabType } from "../interface";
import { reconstructOptions, transitionsAllowed } from "../utils";

const OPRK1: FC<ITabDetail> = (props) => {
  const { handlers, id, executors, transitions, loaderButtonId } = props;
  const { executor } = props.oprk1;

  const [saveOprk1] = useSaveOprk1Mutation();

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

  const formik = useFormik<any>({
    initialValues: {},
    onSubmit: (values) => saveOprk1(values),
  });

  const {
    oprk1_back,
    oprk1_complated,
    oprk1_approve,
    oprk1_executor,
    oprk1_revokesert,
  } = transitions?.buttonSettings || {};

  useEffect(() => {
    formik.setValues(props.oprk1);
  }, [props.oprk1]);

  return (
    <div className="OPRK1">
      <Box paddingX="15px" display="flex" columnGap="20px">
        <Autocomplete<{ label: string; id: string }>
          disablePortal
          value={executorState}
          id="combo-box-demo"
          options={executorList}
          onChange={(e: any, value) => {
            if (value) {
              setExecutor(value);
              formik.setFieldValue("executor", {
                id: value.id,
                value: value.label,
              });
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
          disabled={transitionsAllowed(oprk1_executor?.readOnly)}
          onClick={() => {
            if (executorState) {
              const executor = {
                id: executorState.id,
                value: executorState.label,
              };
              handlers.setExecutor(id, TabType.OPRK1, executor);
            }
          }}
          sx={{ fontWeight: 600, minWidth: "100px", height: "56px" }}
        >
          Сохранить
        </Button>
      </Box>
      <CardGroup title="Сертификаты">
        <Box display="flex" columnGap="15px">
          <TextField
            value={formik.values.sertificatSerial}
            onChange={(event) =>
              formik.setFieldValue("sertificatSerial", event.target.value)
            }
            id="outlined-basic"
            label="Серия"
            variant="outlined"
          />
          <TextField
            value={formik.values.date}
            onChange={(event) =>
              formik.setFieldValue("date", event.target.value)
            }
            id="date"
            label="Дата"
            type="date"
            defaultValue="2017-05-24"
            sx={{ width: 220 }}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <CustomButton
            withRuToken={true}
            type="button"
            color="primary"
            variant="outlined"
            size="medium"
            disabled={transitionsAllowed(oprk1_revokesert?.readOnly)}
            onClick={() => {
              const { sertificatSerial, date } = formik.values;
              handlers.revokeSert(props.id, sertificatSerial, date);
            }}
            sx={{ fontWeight: 600 }}
          >
            Отозвать сертификат
          </CustomButton>
        </Box>
      </CardGroup>
      <Box
        sx={{
          display: "flex",
          justifyContent: "end",
          columnGap: "20px",
          marginBottom: "32px",
          height: "44px",
        }}
      >
        <CustomButton
          type="button"
          color="success"
          loading={"oprk1_complated" === loaderButtonId}
          variant="contained"
          size="medium"
          disabled={transitionsAllowed(oprk1_complated?.readOnly)}
          onClick={() =>
            handlers.modifyRequest(
              "setComplated",
              props.id,
              TabType.OPRK1,
              "oprk1_complated"
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
          loading={"oprk1_back" === loaderButtonId}
          disabled={transitionsAllowed(oprk1_back?.readOnly)}
          onClick={() =>
            handlers.modifyRequest(
              "setBack",
              props.id,
              TabType.OPRK1,
              "oprk1_back"
            )
          }
          sx={{ fontWeight: 600, minWidth: "100px" }}
        >
          Вернуть
        </CustomButton>
        <CustomButton
          type="button"
          loading={"oprk1_approve" === loaderButtonId}
          color="info"
          variant="contained"
          size="medium"
          disabled={transitionsAllowed(oprk1_approve?.readOnly)}
          onClick={() =>
            handlers.modifyRequest(
              "setApprove",
              props.id,
              TabType.OPRK1,
              "oprk1_approve"
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

export default OPRK1;
