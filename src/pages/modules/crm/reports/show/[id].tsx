import { AccountantJobList } from "@components";
import { Loading, SWRError } from "@ui";
import { useParams } from "react-router";
import { useFetchAccountantResponsibilitiesByIdQuery } from "@services/accountantApi";

export const CrmReportsShowPage = () => {
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
