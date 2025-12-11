import { ContractList } from "@components";
import { SWRError , Loading } from "@ui";
import { useParams } from "react-router";
import { useFetchContractByIdQuery } from "@services/contractsApi";

export const DocumentsContractsShowPage = () => {
  const params = useParams();

  const accountantJobRespListId = parseInt(params.id as string);

  const {
    data: accountantJobRespsList,
    isSuccess,
    isFetching,
  } = useFetchContractByIdQuery(accountantJobRespListId);

  return (
    <>
      {isFetching ? (
        <Loading />
      ) : isSuccess ? (
        <ContractList entry={accountantJobRespsList} />
      ) : (
        <SWRError />
      )}
    </>
  );
};
