import { AccountantJobList } from "@components";
import { Loading, SWRError } from "@ui";
import { useFetchAccountantResponsibilitiesByIdQuery } from "@services/accountantApi";
import { useParams } from "react-router";

export const CrmIndividualsShowPage = () => {
  const router = useParams();

  const accountantJobRespListId = parseInt(router.id as string);

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
