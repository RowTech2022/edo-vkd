import { useEffect, useState } from "react";
import {
  Button,
  TextField,
  Dialog,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import {
  FileAddIcon,
  Card,
  DataTable,
  ListIcon,
  Loading,
  RegionsAndAreas,
} from "@ui";
import { CrmCreate } from "../create";
import {
  useLazyFetchOrganisationSearchQuery,
  IOrganizationSearchRequest,
  IOrganizationSearchResponse,
} from "@services/organizationsApi";

import { organizationColumns } from "./organizationColumns";
import { Link } from "react-router-dom";
import { usePagination } from "@hooks";

type Props = {
  orgType: { id: string; value: string };
};

const Registry = (props: Props) => {
  const pagination = usePagination();

  const { page, pageSize, setPage, setPageSize } = pagination;

  const [totalItems, setTotalItems] = useState<number>(1);
  const [regionName, setRegionName] = useState<string>("");
  const [items, setItems] = useState<IOrganizationSearchResponse[]>();
  const [inn, setInn] = useState<string>("");
  const [withoutTerCode, setWithoutTerCode] = useState<boolean>(false);
  const [orgId, setOrgId] = useState<string>("");

  const [activeRegion, setActiveRegion] = useState<number>(0);
  const [currentFilter, setCurrentFilter] = useState<
    Nullable<IOrganizationSearchRequest>
  >({
    filters: {
      terCode: activeRegion,
      inn: inn,
      orgId: orgId,
      orgType: props.orgType,
    },
  });

  const [createMode, setCreateMode] = useState(false);

  const [fetchIncomingLetters, { isFetching }] =
    useLazyFetchOrganisationSearchQuery();

  const fetchData = async (
    region: number,
    args: Nullable<IOrganizationSearchRequest> | void
  ) => {
    if (withoutTerCode) {
      const { data } = await fetchIncomingLetters({
        ...args,
        filters: {
          terCode: null,
          orgType: props.orgType,
          inn: inn,
          orgId: orgId,
        },
      });
      setItems(data?.items);
      setTotalItems(data?.total || 0);
      return;
    }

    if (activeRegion !== 0) {
      const { data } = await fetchIncomingLetters({
        ...args,
        filters: {
          terCode: region,
          orgType: props.orgType,
          inn: inn,
          orgId: orgId,
        },
      });
      setItems(data?.items);
      setTotalItems(data?.total || 0);
    }
  };

  const openForm = (id: string) => {
    let url = window.location.href;
    var lst = window.location.href.lastIndexOf("/");
    if (lst != -1) {
      url = url.substring(0, lst);
    }
    window.open(url + `/organization/${id}`, "_blank");
  };

  const search = (region1: number) => {
    setPage(1);
    fetchData(region1, { pageInfo: { pageNumber: 1 }, ...currentFilter });
  };

  useEffect(() => {
    fetchData(activeRegion, {
      pageInfo: { pageNumber: page + 1, pageSize: pageSize },
      ...currentFilter,
    });
  }, [page, pageSize]);

  return (
    <Card title={"Реестр" + "   (" + regionName + ")"}>
      <RegionsAndAreas
        onChange={(region: number, regionName: string) => {
          setRegionName(regionName);
          setActiveRegion(region);
          search(region);
          setInn("");
        }}
      />
      <div className="tw-grid tw-grid-cols-[1fr_187px] tw-w-full tw-gap-4 tw-mb-4">
        <div className="tw-grid tw-grid-flow-col-dense tw-auto-cols-[187px] tw-gap-4">
          <TextField
            name="address"
            label="ИНН*"
            value={inn}
            onChange={(event) => setInn(event.target.value)}
            size="small"
          />
          <TextField
            name="orgId"
            label="Идентификатор*"
            value={orgId}
            onChange={(event) => setOrgId(event.target.value)}
            size="small"
          />
          <FormControlLabel
            sx={{ width: "200px" }}
            label="Без код территории"
            control={
              <Checkbox
                checked={withoutTerCode}
                onChange={(e, check) => {
                  setWithoutTerCode(check);
                }}
              />
            }
          />
          <Button
            startIcon={
              isFetching ? (
                <Loading />
              ) : (
                <ListIcon
                  width="18px"
                  height="18px"
                  fill="currentColor"
                  stroke="none"
                />
              )
            }
            disabled={isFetching}
            onClick={() => search(activeRegion)}
          >
            Список
          </Button>
        </div>
        <Link to={""}>
          <Button
            sx={{ float: "right" }}
            variant="contained"
            startIcon={
              <FileAddIcon
                width="18px"
                height="18px"
                fill="currentColor"
                stroke="none"
              />
            }
            onClick={() => setCreateMode(true)}
          >
            Добавить
          </Button>
        </Link>
      </div>
      <DataTable
        pushUri={"/modules/crm/organization"}
        columns={organizationColumns}
        items={items}
        isLoading={isFetching}
        totalItems={totalItems}
        {...pagination}
      />
      <Dialog
        open={createMode}
        maxWidth="xl"
        onClose={() => {}}
        onBackdropClick={() => setCreateMode(false)}
      >
        <CrmCreate
          onClose={() => {
            setCreateMode(false);
            search(activeRegion);
          }}
          orgType={props.orgType}
          m_new={true}
        />
      </Dialog>
    </Card>
  );
};

export default Registry;
