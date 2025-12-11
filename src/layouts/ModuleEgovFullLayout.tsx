import { PropsWithChildren, useEffect, useState } from "react";
import {
  IModuleResponse,
  useLazyFetchMyOrganisationsQuery,
} from "@services/userprofileApi";
import {
  IEgovServicesGetByOrgIdResponse,
  useLazyFetchEgovServicesByOrgIdQuery,
} from "@services/egovServices";
import { Autocomplete, Stack } from "@mui/material";
import { useNavigate, useParams } from "react-router";
import { CustomTextField } from "@ui";
import { useSession } from "@hooks";
import FoldersPanel from "@root/components/EDO/EgovFull/Service/folders";

const defaultValue = {
  id: 0,
  inn: "",
  name: "",
  displayName: "",
  address: "",
};

type Props = {
  ignoreSub?: boolean;
};

export const ModuleEgovFullLayout = ({
  children,
}: PropsWithChildren<Props>) => {
  const { data: session, status } = useSession();
  const admin = session?.user?.roles?.includes(1);
  const navigate = useNavigate();
  const { fid, sid } = useParams();

  const orgId = fid ? Number(fid) : 0;
  const srvId = Number(sid) ? String(sid) : 0;
  const [fetchAllOrganisations] = useLazyFetchMyOrganisationsQuery();
  const [fetchServices] = useLazyFetchEgovServicesByOrgIdQuery();

  const [organisations, setOrganisations] = useState<IModuleResponse[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<IModuleResponse>(defaultValue);

  const [services, setServices] = useState<
    IEgovServicesGetByOrgIdResponse[] | []
  >([]);
  const [selectedService, setSelectedService] = useState<any>(0);

  const fetchAllOrgs = async () => {
    const { data } = await fetchAllOrganisations();
    if (data) setOrganisations(data.items);
  };

  const fetchDataServices = async (id: number) => {
    const { data } = await fetchServices(id);
    if (data) setServices(data);
  };

  useEffect(() => {
    if (orgId) {
      fetchDataServices(orgId);
    } else {
      setServices([]);
      setSelectedOrg(defaultValue);
    }
  }, [orgId]);

  useEffect(() => {
    setSelectedService(srvId);
  }, [srvId]);

  useEffect(() => {
    if (admin) {
      fetchAllOrgs();
    }
  }, [admin]);

  useEffect(() => {
    if (orgId && organisations)
      organisations.map((item) => {
        item.id === orgId && setSelectedOrg(item);
      });
  }, [orgId, organisations]);

  return (
    <>
      <div
        id="submodules-nav"
        className={`tw-mb-4 tw-py-6 tw-px-4 tw-bg-white tw-rounded-lg tw-overflow-hidden tw-overflow-x-auto tw-no-scrollbar tw-shadow-[0_0_4px_0_#00000025]`}
      >
        <nav className="tw-h-full tw-flex tw-flex-col tw-gap-4">
          {admin && (
            <Autocomplete
              sx={{ maxWidth: "400px" }}
              disablePortal
              options={organisations || []}
              getOptionLabel={(option) => option.name}
              size="small"
              renderInput={(params) => (
                <CustomTextField params={params} label="Организация" />
              )}
              value={selectedOrg}
              onChange={(event, value) => {
                const link = value?.id
                  ? `/modules/egovFull/Organisation/${value?.id}`
                  : "/modules/egovFull";
                navigate(link);
              }}
            />
          )}
          {services && services?.length > 0 && (
            <Stack className="tw-w-full tw-gap-4">
              <FoldersPanel
                items={services}
                selectedService={selectedService}
                setSelectedService={setSelectedService}
              />
            </Stack>
          )}
        </nav>
      </div>
      <div>{children}</div>
    </>
  );
};
