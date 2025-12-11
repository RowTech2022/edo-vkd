import { Box, Card } from "@mui/material";
import { Fact, FileLoader, SectionTabs, CustomSkeleton } from "@ui";
import { useParams } from "react-router";
import { useEffect, useMemo, useState } from "react";
import {
  IApplicationByIdResponse,
  useFetchApplicationByIdQuery,
  useSetExecutorMutation,
  useSetComplatedMutation,
  useSetBackMutation,
  useSetApproveMutation,
  useSetDoneMutation,
  useSertRequestMutation,
  useRevokeSertMutation,
} from "@services/applicationsApi";
import { useFetchUsersQuery } from "@services/userprofileApi";
import { applicationTabItems } from "../statics";
import { isTransitionsAllowed } from "./tabs/utils";
import { nextTab } from "./constants";

export type TModifyCallback = (
  action: string,
  id: number,
  type: number
) => void;
export type TExecutor = IApplicationByIdResponse["oprk1"]["executor"];
export interface IRequestHandlers {
  modifyRequest: (
    action: string,
    id: number,
    type: number,
    loaderButtonId?: string
  ) => void;
  setExecutor: (id: number, type: number, executor: TExecutor) => void;
  sertRequest: (id: number, sertificatSerial: string, date: string) => void;
  revokeSert: (id: number, sertificatSerial: string, date: string) => void;
}

const Application = () => {
  const params = useParams();
  const applicationId = params.id as string;

  const [data, setData] = useState<IApplicationByIdResponse | null>(null);
  const [defaultTab, setDefaultTab] = useState("oprk1");
  const [buttonLoader, setButtonLoader] = useState("");

  const { data: fetchedData = null, isFetching } = useFetchApplicationByIdQuery(
    Number(applicationId)
  );

  const [setExecutor] = useSetExecutorMutation();
  const [setComplated] = useSetComplatedMutation();
  const [setBack] = useSetBackMutation();
  const [setApprove] = useSetApproveMutation();
  const [setDone] = useSetDoneMutation();
  const [sertRequest] = useSertRequestMutation();
  const [revokeSert] = useRevokeSertMutation();

  const handlers: IRequestHandlers = {
    modifyRequest: (
      action: string,
      id: number,
      type: number,
      loaderButtonId?: string
    ) => {
      const api: any = {
        setComplated,
        setBack,
        setApprove,
        setDone,
      };

      if (loaderButtonId) {
        setButtonLoader(loaderButtonId);
      }

      if (api[action]) {
        api[action]({ type, id })
          .then((res: any) => {
            setData(res.data);
            setButtonLoader("");
            if (action === "setComplated") {
              setDefaultTab(nextTab[type]);
            }
          })
          .catch((err: any) => {
            console.log(err);
            setButtonLoader("");
          });
      }
    },

    setExecutor: (id: number, type: number, executor: TExecutor) => {
      if (setExecutor) {
        setExecutor({ id, type, executor })
          .then((res: any) => setData(res.data))
          .catch((err) => console.log(err));
      }
    },

    sertRequest: (id: number, sertificatSerial: string, date: string) => {
      if (sertRequest) {
        sertRequest({ id, sertificatSerial, date })
          .then((res: any) => setData(res.data))
          .catch((err: any) => console.log(err));
      }
    },

    revokeSert: (id: number, sertificatSerial: string, date: string) => {
      if (revokeSert) {
        revokeSert({ id, sertificatSerial, date })
          .then((res: any) => setData(res.data))
          .catch((err: any) => console.log(err));
      }
    },
  };

  useEffect(() => {
    setData(fetchedData);
  }, [fetchedData]);

  const {
    organisation: {
      id: organizationId = "",
      value: organizationName = "",
    } = {},
    inn,
    fio,
    serialNumber,
    hasToken,
    tokenNumber,
    phone,
    email,
    docDate,
  } = data || {};

  const getStatus = (value: number) => {
    if (!data?.state) return "";
    const bigger = data.state - value;
    return bigger > 0 ? "done" : !bigger ? "inProgress" : "empty";
  };

  const { data: users } = useFetchUsersQuery();
  const { items: executors = [] } = users || {};

  const tabsPropsData = useMemo(
    () => ({
      ...data,
      handlers,
      loaderButtonId: buttonLoader,
      executors,
    }),
    [buttonLoader, data, executors]
  );

  const tabsVisibility = (data && data.transitions?.fieldSettings) || {};

  const isTabVisible = (value: string) =>
    isTransitionsAllowed
      ? tabsVisibility[value] && !tabsVisibility[value].readOnly
      : false;

  return (
    <div className="Organization">
      <h1 style={{ marginBottom: "16px" }}>Информация о заявки</h1>
      <Card sx={{ padding: "30px" }}>
        <Box display="flex" columnGap="8rem">
          <CustomSkeleton
            containerWidth="320px"
            isLoading={isFetching}
            height="30px"
            row={6}
            widthPatterns={["80%", "60%", "65%", "100%", "70%", "30%"]}
          >
            <Box>
              <Fact name="ID Орг" value={organizationId} />
              <Fact name="ФИО" value={fio} />
              <Fact name="ИНН" value={inn} />
              <Fact name="Серия паспорта" value={serialNumber} />
              <Fact name="Дата" value={docDate} />
            </Box>
          </CustomSkeleton>
          <CustomSkeleton
            containerWidth="400px"
            isLoading={isFetching}
            height="32px"
            row={5}
            widthPatterns={["30%", "35%", "100%", "30%", "100%"]}
          >
            <Box>
              <Fact name="Наличие токена" value={hasToken ? "Да" : "Нет"} />
              <Fact name="Серия токена" value={tokenNumber} />
              <Fact name="Тел" value={phone} />
              <Fact name="Mail" value={email} />
            </Box>
          </CustomSkeleton>
        </Box>
        <Box display="flex" columnGap="20px">
          <FileLoader title="Приказ" />
          <FileLoader title="Копия паспорта" />
        </Box>
      </Card>

      {data && (
        <SectionTabs
          items={applicationTabItems}
          propsData={tabsPropsData}
          getStatus={getStatus}
          isTabVisbile={isTabVisible}
          defaultTab={defaultTab}
        />
      )}
    </div>
  );
};

export default Application;
