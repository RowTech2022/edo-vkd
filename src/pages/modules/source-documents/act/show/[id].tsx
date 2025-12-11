import { ActList } from "@components";
import { SWRError , Loading } from "@ui";
import { useParams } from "react-router";
import { useFetchActByIdQuery } from "@services/ActApi";

export const DocumentsActShowPage = () => {
  const params = useParams();

  const accountantJobRespListId = parseInt(params.id as string);

  const {
    data: accountantJobRespsList,
    isSuccess,
    isFetching,
  } = useFetchActByIdQuery(accountantJobRespListId);

  return (
    <>
      {isFetching ? (
        <Loading />
      ) : isSuccess ? (
        <ActList entry={accountantJobRespsList} />
      ) : (
        <SWRError />
      )}
    </>
  );
};
