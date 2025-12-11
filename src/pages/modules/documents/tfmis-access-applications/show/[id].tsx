import { SWRError , Loading } from "@ui";
import { TfmisAccessApplication } from "@root/components/EDO";
import { useParams } from "react-router";
import { useFetchTFMISAccessApplicationByIdQuery } from "@services/tfmisApi";

export const TfmisAccessApplicationShowPage = () => {
  const params = useParams();

  const tfmisApplicationId = parseInt(params.id as string);
  const {
    data: application = {} as TFMIS.AccessApplication,
    isSuccess,
    isFetching,
  } = useFetchTFMISAccessApplicationByIdQuery(tfmisApplicationId);

  return (
    <>
      {isFetching ? (
        <Loading />
      ) : isSuccess ? (
        <TfmisAccessApplication new={false} entry={application} />
      ) : (
        <SWRError />
      )}
    </>
  );
};
