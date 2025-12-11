import { SWRError , Loading } from "@ui";
import { OutcomingCreate } from "@components";
import { useParams } from "react-router";
import { useFetchOutcomingByIdQuery } from "@services/outcomingApi";

export const LettersOutcomingShowPage = () => {
  const params = useParams();

  const outId = parseInt(params.id as string);
  const {
    data: outcomingLetterList,
    isSuccess,
    isFetching,
  } = useFetchOutcomingByIdQuery(outId);

  return (
    <>
      {isFetching ? (
        <Loading />
      ) : isSuccess ? (
        <OutcomingCreate new={false} entry={outcomingLetterList} />
      ) : (
        <SWRError />
      )}
    </>
  );
};
