import { WaybillPage } from "@components";
import { SWRError , Loading } from "@ui";
import { useParams } from "react-router";
import { useFetchWaybillByIdQuery } from "@services/waybillsApi";

export const DocumentsWaybillsShowPage = () => {
  const params = useParams();

  const waybillId = parseInt(params.id as string);
  const {
    data: proxyData,
    isSuccess,
    isFetching,
  } = useFetchWaybillByIdQuery(waybillId);

  return (
    <>
      {isFetching ? (
        <Loading />
      ) : isSuccess ? (
        <WaybillPage entry={proxyData} />
      ) : (
        <SWRError />
      )}
    </>
  );
};
