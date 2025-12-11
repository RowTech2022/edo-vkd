import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  LinearProgress,
  TextField,
} from "@mui/material";
import { CardGroup , CustomPagination , CustomButton } from "@ui";
import { FC, useEffect, useMemo, useState } from "react";
import {
  IApplicationByIdResponse,
  IServiceAddItem,
  IServiceItem,
  useFetchServicesQuery,
  useSaveOprk2Mutation,
} from "@services/applicationsApi";
import { DataGrid } from "@mui/x-data-grid";
import { oprk2Columns } from "@root/components/EDO/Requests/statics";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Formik } from "formik";
import { initialAddServiceValues, IService } from "./schema";
import { IExecutor, ITabDetail, TabType } from "../interface";
import { reconstructOptions, transitionsAllowed } from "../utils";

const OPRK2: FC<ITabDetail> = (props) => {
  const { handlers, id, executors, transitions, loaderButtonId } = props;
  const { executor, sertificatSerial, date } = props.oprk2;
  const [openModal, setOpenModal] = useState(false);
  const [dateState, setDate] = useState(date);
  const [sertificate, setSertificate] = useState(sertificatSerial);

  const [saveOprk2] = useSaveOprk2Mutation();

  const [services, setServices] = useState<IServiceAddItem[]>([]);
  const executorList = useMemo(
    () => reconstructOptions(executors || []),
    [executors]
  );

  const defaultVal = useMemo(() => {
    let found = executor;
    if (executors) {
      found = executors?.find((item) => executor?.id === item.id) as IExecutor;
    }
    if (!found) return null;
    return { label: found.value, id: found.id };
  }, [executors, executor]);
  const [executorState, setExecutor] = useState(defaultVal || null);
  const { data: serviceList } = useFetchServicesQuery(null);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    const { services } = props.oprk2;

    if (services) {
      setServices(services);
    }
  }, [props.oprk2]);

  const handlersInner = {
    onSubmit(values: IService) {
      const {
        code = "",
        price = 0,
        count = 0,
        measure = "",
        ndcSumma = 0,
        service: selected,
      } = values;
      const service: IServiceAddItem = {
        serviceId: selected?.id as number,
        code,
        price: price as number,
        count: count as number,
        measure: measure as string,
        ndsSumma: ndcSumma as number,
        total: (price || 0) * (count || 0) + (ndcSumma || 0),
      };
      setServices([...services, service]);
      setOpenModal(false);
    },
  };

  const {
    oprk2_executor,
    oprk2_requestsert,
    oprk2_back,
    oprk2_approve,
    oprk2_complated,
  } = transitions.buttonSettings || {};

  const serviceTableData = useMemo(
    () => services.map((item, idx) => ({ ...item, id: idx + 1 })),
    [services]
  );

  const onSave = () => {
    const data: IApplicationByIdResponse["oprk2"] = {
      ...props.oprk2,
      id: props.id,
      executor: {
        value: executorState?.label || "",
        id: executorState?.id || "",
      },
      sertificatSerial: sertificate,
      date: new Date(dateState).toISOString(),
      services: services,
    };

    setSaveLoading(true);
    saveOprk2(data)
      .then((res) => console.log(res))
      .catch((err) => console.log(err))
      .finally(() => setSaveLoading(false));
  };

  return (
    <div className="OPRK2">
      <Box paddingX="15px" display="flex" columnGap="20px">
        <Autocomplete<{ label: string; id: string }>
          disablePortal
          value={executorState}
          id="combo-box-demo"
          options={executorList}
          onChange={(e: any, value) => {
            if (value) {
              setExecutor(value);
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
          disabled={transitionsAllowed(oprk2_executor?.readOnly)}
          onClick={() => {
            if (executorState) {
              const executor = {
                id: executorState.id,
                value: executorState.label,
              };
              handlers.setExecutor(id, TabType.OPRK2, executor);
            }
          }}
          sx={{ fontWeight: 600, minWidth: "100px", height: "56px" }}
        >
          Сохранить
        </Button>
      </Box>
      <Box maxWidth="760px">
        <CardGroup title="Сертификаты">
          <Box display="flex" columnGap="15px">
            <TextField
              value={sertificate}
              onChange={(event) => setSertificate(event.target.value)}
              id="outlined-basic"
              label="Серия"
              variant="outlined"
            />
            <TextField
              value={dateState}
              onChange={(event) => setDate(event.target.value)}
              id="date"
              label="Дата"
              type="date"
              defaultValue="2017-05-24"
              sx={{ width: 220 }}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <Button
              type="button"
              color="primary"
              variant="outlined"
              size="medium"
              disabled={transitionsAllowed(oprk2_requestsert?.readOnly)}
              onClick={() => {
                handlers.sertRequest(props.id, sertificate, dateState);
              }}
              sx={{ fontWeight: 600 }}
            >
              Создать запрос
            </Button>
          </Box>
        </CardGroup>
      </Box>

      <Box paddingTop="30px">
        <Box display="flex" marginBottom="15px" justifyContent="end">
          <Button
            type="button"
            color="primary"
            variant="contained"
            size="medium"
            onClick={() => setOpenModal(true)}
            sx={{ fontWeight: 600, height: "42px" }}
            startIcon={<AddCircleOutlineIcon fontSize="small" />}
          >
            Добавить услугу
          </Button>
        </Box>
        <DataGrid
          classes={{
            root: "tw-bg-white !tw-rounded-lg",
            row: "tw-cursor-pointer",
          }}
          columns={oprk2Columns}
          rows={serviceTableData}
          autoHeight
          hideFooterSelectedRowCount
          initialState={{
            pagination: {
              page: 1,
              pageSize: 10,
            },
          }}
          pagination
          paginationMode="server"
          rowsPerPageOptions={[10]}
          components={{
            LoadingOverlay: LinearProgress,
            Pagination: CustomPagination,
          }}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          columnGap: "20px",
          marginTop: "32px",
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
          onClick={onSave}
          sx={{ fontWeight: 600, minWidth: "100px" }}
        >
          Сохранить
        </CustomButton>
        <CustomButton
          type="button"
          color="success"
          variant="contained"
          size="medium"
          loading={"oprk2_complated" === loaderButtonId}
          disabled={transitionsAllowed(oprk2_complated?.readOnly)}
          onClick={() =>
            handlers.modifyRequest(
              "setComplated",
              props.id,
              TabType.OPRK2,
              "oprk2_complated"
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
          loading={"oprk2_back" === loaderButtonId}
          disabled={transitionsAllowed(oprk2_back?.readOnly)}
          onClick={() =>
            handlers.modifyRequest(
              "setBack",
              props.id,
              TabType.OPRK2,
              "oprk2_back"
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
          loading={"oprk2_approve" === loaderButtonId}
          disabled={transitionsAllowed(oprk2_approve?.readOnly)}
          onClick={() =>
            handlers.modifyRequest(
              "setApprove",
              props.id,
              TabType.OPRK2,
              "oprk2_approve"
            )
          }
          sx={{ fontWeight: 600, minWidth: "100px" }}
        >
          Утвердить
        </CustomButton>
      </Box>

      <Dialog
        open={openModal}
        onClose={() => {}}
        onBackdropClick={() => setOpenModal(false)}
      >
        <Formik
          initialValues={initialAddServiceValues}
          onSubmit={(values) => handlersInner.onSubmit(values)}
        >
          {(formik) => (
            <form onSubmit={formik.handleSubmit}>
              <Box padding="20px 30px" minWidth="400px">
                <DialogTitle className="tw-bg-primary">
                  Добавление услуги
                </DialogTitle>
                <Box display="flex" flexDirection="column" rowGap="20px">
                  <Autocomplete<IServiceItem>
                    disablePortal
                    value={formik.values.service}
                    id="combo-box-demo"
                    options={serviceList?.items || []}
                    getOptionLabel={(option) => option.name}
                    onChange={(e: any, value) => {
                      if (value) {
                        formik.setFieldValue("service", value);
                        formik.setFieldValue("code", value.code);
                        formik.setFieldValue("measure", value.mesaure);
                      }
                    }}
                    sx={{ marginBottom: "16px" }}
                    renderInput={(params) => (
                      <TextField {...params} label="Сервис" />
                    )}
                  />
                  <TextField
                    disabled
                    value={formik.values.code}
                    id="outlined-basic"
                    label="Код"
                    variant="outlined"
                  />
                  <TextField
                    disabled
                    value={formik.values.measure}
                    id="outlined-basic"
                    label="Ед.Измерения"
                    variant="outlined"
                  />
                  <TextField
                    type="number"
                    value={formik.values.price}
                    id="outlined-basic"
                    label="Цена"
                    variant="outlined"
                    onChange={(event: any) =>
                      formik.setFieldValue("price", Number(event.target.value))
                    }
                  />
                  <TextField
                    type="number"
                    value={formik.values.count}
                    id="outlined-basic"
                    label="Количество"
                    variant="outlined"
                    onChange={(event: any) =>
                      formik.setFieldValue("count", Number(event.target.value))
                    }
                  />
                  <TextField
                    type="number"
                    value={formik.values.ndcSumma}
                    id="outlined-basic"
                    label="Сумма НДС"
                    variant="outlined"
                    onChange={(event: any) =>
                      formik.setFieldValue(
                        "ndcSumma",
                        Number(event.target.value)
                      )
                    }
                  />
                </Box>
                <Box paddingTop="15px">
                  <DialogActions>
                    <Button
                      type="submit"
                      variant="contained"
                      size="medium"
                      sx={{ fontWeight: 600, minWidth: "100px" }}
                    >
                      Добавить
                    </Button>
                  </DialogActions>
                </Box>
              </Box>
            </form>
          )}
        </Formik>
      </Dialog>
    </div>
  );
};

export default OPRK2;
