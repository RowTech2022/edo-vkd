import { AccountantJobList } from "@components";
import { SWRError , Loading } from "@ui";
import { useParams } from "react-router";
import { useFetchAccountantResponsibilitiesByIdQuery } from "@services/accountantApi";

export const ChiefAccountantJobResponsibilitiesShowPage = () => {
  const params = useParams();

  const accountantJobRespListId = parseInt(params.id as string);

  const {
    data: accountantJobRespsList,
    isSuccess,
    isFetching,
  } = useFetchAccountantResponsibilitiesByIdQuery(accountantJobRespListId);

  return (
    <>
      {isFetching ? (
        <Loading />
      ) : isSuccess ? (
        <AccountantJobList entry={accountantJobRespsList} />
      ) : (
        <SWRError />
      )}
    </>
  );
};
