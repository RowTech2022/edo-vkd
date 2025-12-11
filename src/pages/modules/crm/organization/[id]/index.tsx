import Organzation from "@root/components/EDO/Crm/Organization";
import { Loading, SWRError1 } from "@ui";
import { useEffect } from "react";
import { useParams } from "react-router";
import { useLazyFetchOrganizationByIdQuery } from "@services/organizationsApi";

export const CrmOrganizationShowPage = () => {
  const params = useParams();

  const id = parseInt(params.id as string);

  const [fetchOrgById, { data: organisation, isFetching, isSuccess, error }] =
    useLazyFetchOrganizationByIdQuery();

  useEffect(() => {
    fetchOrgById(id);
  }, [id]);

  const refetch = () => {
    fetchOrgById(id);
  };

  return (
    <>
      {isFetching ? (
        <Loading />
      ) : isSuccess && organisation ? (
        <Organzation entry={organisation} refetch={refetch} />
      ) : (
        <SWRError1 message={(error as any)?.data?.Message} />
      )}
    </>
  );
};
