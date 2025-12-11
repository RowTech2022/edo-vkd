import { ProxyList } from "@components";
import { SWRError , Loading } from "@ui";
import { useParams } from "react-router";
import { useFetchProxyByIdQuery } from "@services/proxyApi";

export const DocumentsProxiesShowPage = () => {
  const params = useParams();

  const proxyId = parseInt(params.id as string);

  const {
    data: proxyData,
    isSuccess,
    isFetching,
  } = useFetchProxyByIdQuery(proxyId);

  return (
    <>
      {isFetching ? (
        <Loading />
      ) : isSuccess ? (
        <ProxyList entry={proxyData} />
      ) : (
        <SWRError />
      )}
    </>
  );
};
