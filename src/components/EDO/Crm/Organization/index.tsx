import {
  Box,
  Card,
  List,
  ListItem,
  ListItemText,
  Dialog,
  Button,
} from "@mui/material";
import { useState } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { CrmCreate } from "../create";
import { formatDate, getParamFromUrl } from "@utils";
import {
  ChevronLeftIcon,
  SectionTabs,
  CustomSkeleton,
  CustomAccordion,
  Fact,
} from "@ui";
import { tabItems } from "./statics";
import { useNavigate } from "react-router";
import { downloadFile } from "@hooks";

type Props = {
  entry: any;
  refetch?: () => void;
};

const Organzation = (props: Props) => {
  const navigate = useNavigate();

  const [createMode, setCreateMode] = useState(false);
  const mdata: any = props.entry || {
    id: 0,
    name: "",
    inn: "",
    contractNo: "",
    contractDate: "",
    address: "",

    grbs: null,
    pbs: null,
    seqnums: [],
    //files: [],
    requisites: [],

    files: [],
    orgType: null,
    terCode: null,
    treasureCode: null,
    parrenOrg: null,

    headFio: "",
    headPhone: "",
    headEmail: "",
    custId: 0,
    status: 1,
    accountantFio: "",
    accountantPhone: "",
    accountantEmail: "",
  };

  const setDownloadFile = async (url: string) => {
    if (url === "") return;
    downloadFile(url, Math.random().toString());
  };

  return (
    <div className="Organization" style={{ padding: "4rem" }}>
      <Card sx={{ padding: "30px" }}>
        <Box display="flex" columnGap="8rem">
          <CustomSkeleton
            containerWidth="320px"
            isLoading={false}
            height="30px"
            row={6}
            widthPatterns={["80%", "60%", "65%", "100%", "70%", "30%"]}
          >
            <Box>
              <h2 style={{ marginBottom: "16px" }}>Карточка организации</h2>
              <Fact name="Название" value={mdata.name as string} />
              <Box display="flex" columnGap="20px">
                <Fact name="ID" value={mdata.id as number} />
              </Box>
              <Fact name="Идентификатор" value={mdata.orgId as string} />
              <Fact name="ИНН" value={mdata?.inn as string} />
              <Fact
                name="Вышестоящая организация"
                value={mdata?.parrenOrg?.value as string}
              />
              <Box display="flex" columnGap="20px">
                <Fact name="Договор" value={mdata.contractNo as string} />
                <Fact name="Дата" value={formatDate(mdata.contractDate)} />
              </Box>
              <Fact name="ГРБС" value={mdata?.grbsResponsible?.value} />
              <Fact name="ПБС" value={mdata?.pbs?.value} />
              <CustomAccordion
                title="БЗ"
                subtitle={mdata.seqnums?.length ? mdata.seqnums[0].value : ""}
              >
                <List sx={{ "&.MuiList-root": { padding: 0 } }}>
                  {mdata.seqnums &&
                    mdata.seqnums.map((item: any) => (
                      <ListItem
                        sx={{ paddingY: 0 }}
                        key={item?.id}
                        disablePadding
                      >
                        <ListItemText primary={item?.value} />
                      </ListItem>
                    ))}
                </List>
              </CustomAccordion>
              <CustomAccordion
                title="Реквизиты"
                subtitle={mdata.requisites?.length ? mdata.requisites[0] : ""}
              >
                <List sx={{ "&.MuiList-root": { padding: 0 } }}>
                  {mdata.requisites &&
                    mdata.requisites.map((item: string) => (
                      <ListItem sx={{ paddingY: 0 }} key={item} disablePadding>
                        <ListItemText primary={item} />
                      </ListItem>
                    ))}
                </List>
              </CustomAccordion>{" "}
              <CustomAccordion
                title="Файлы Документ"
                subtitle={mdata.files?.length}
              >
                <List sx={{ "&.MuiList-root": { padding: 0 } }}>
                  {mdata.files &&
                    mdata.files.map((item: any) => (
                      <ListItem
                        sx={{ paddingY: 0 }}
                        key={item.id}
                        disablePadding
                      >
                        <ListItemText
                          className="tw-whitespace-nowrap tw-truncate hover:tw-underline hover:tw-text-secondary tw-cursor-pointer"
                          primary={
                            item.name ||
                            getParamFromUrl(item.url, "fileName") ||
                            "Не удалось получить имя файла"
                          }
                          onClick={() => setDownloadFile(item.url)}
                        />
                      </ListItem>
                    ))}
                </List>
              </CustomAccordion>
              <CustomAccordion
                title="Файлы Бланк"
                subtitle={mdata.files?.length}
              >
                <List sx={{ "&.MuiList-root": { padding: 0 } }}>
                  {mdata.files &&
                    mdata.files.map((item: any) => (
                      <ListItem
                        sx={{ paddingY: 0 }}
                        key={item.id}
                        disablePadding
                      >
                        <ListItemText
                          className="tw-whitespace-nowrap tw-truncate hover:tw-underline hover:tw-text-secondary tw-cursor-pointer"
                          primary={
                            item.name ||
                            getParamFromUrl(item.url, "fileName") ||
                            "Не удалось получить имя файла"
                          }
                          onClick={() => setDownloadFile(item.url)}
                        />
                      </ListItem>
                    ))}
                </List>
              </CustomAccordion>
            </Box>
          </CustomSkeleton>
          {/* <Fact name="АДРЕСС" value={address} /> */}
          <CustomSkeleton
            containerWidth="400px"
            isLoading={false}
            height="32px"
            row={5}
            widthPatterns={["30%", "35%", "100%", "30%", "100%"]}
          >
            <Box>
              <h2 style={{ marginBottom: "16px" }}>Контакты</h2>
              <h3
                style={{
                  fontSize: "19px",
                  minHeight: "32px",
                }}
              >
                Руководитель:
              </h3>
              <Box display="flex" columnGap="30px" marginBottom="12px">
                <Fact name="ФИО" value={mdata.headFio as string} />
                <Fact name="Тел" value={mdata.headPhone as string} />
                <Fact name="Mail" value={mdata.headEmail as string} />
              </Box>

              <h3 style={{ marginBottom: "5px", fontSize: "19px" }}>
                Бухгалтер:
              </h3>
              <Box display="flex" columnGap="30px" marginBottom="12px">
                <Fact name="ФИО" value={mdata.accountantFio as string} />
                <Fact name="Тел" value={mdata.accountantPhone as string} />
                <Fact name="Mail" value={mdata.accountantEmail as string} />
              </Box>
            </Box>
          </CustomSkeleton>
        </Box>
        <Box display="flex" gap={4} justifyContent="end">
          <Button
            type="button"
            color="primary"
            variant="contained"
            size="medium"
            onClick={() => navigate(-1)}
            sx={{ fontWeight: 600, height: "42px" }}
            startIcon={
              <ChevronLeftIcon
                width="16px"
                height="16px"
                fill="currentColor"
                stroke="none"
              />
            }
          >
            Назад
          </Button>
          <Button
            type="button"
            color="primary"
            variant="contained"
            size="medium"
            onClick={() => setCreateMode(true)}
            sx={{ fontWeight: 600, height: "42px" }}
            startIcon={<AddCircleOutlineIcon fontSize="small" />}
          >
            Редактировать
          </Button>
        </Box>
      </Card>

      <SectionTabs items={tabItems} defaultTab="oprk1" />

      <Dialog
        open={createMode}
        maxWidth="lg"
        onClose={() => {}}
        onBackdropClick={() => setCreateMode(false)}
      >
        <CrmCreate
          onClose={() => {
            setCreateMode(false);
            props?.refetch?.();
          }}
          orgType={props.entry?.orgType || { id: "1", value: "" }}
          m_new={false}
          m_data={mdata}
        />
      </Dialog>
    </div>
  );
};

export default Organzation;
