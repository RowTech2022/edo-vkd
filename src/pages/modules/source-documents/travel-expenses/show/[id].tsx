import { TravelExpensesPage } from "@components";
import { SWRError , Loading } from "@ui";
import { useParams } from "react-router";
import { useFetchTravelExpenseByIdQuery } from "@services/travelExpensesApi";

export const DocumentsTravelExpensesShowPage = () => {
  const params = useParams();
  const travelId = parseInt(params.id as string);

  const {
    data: proxyData,
    isSuccess,
    isFetching,
  } = useFetchTravelExpenseByIdQuery(travelId);

  return (
    <>
      {isFetching ? (
        <Loading />
      ) : isSuccess ? (
        <TravelExpensesPage entry={proxyData} />
      ) : (
        <SWRError />
      )}
    </>
  );
};
