import { SWRError , Loading } from "@ui";
import { OutcomingNewCreate } from "@components";
import { useParams } from "react-router";
import { useFetchInternalIncomingLettersOutByIdQuery } from "@services/internal/incomingApi";

export const LettersNewOutcomingShowPage = () => {
  const params = useParams();

  const outId = parseInt(params.id as string);

  const {
    data: outcomingLetterList,
    isSuccess,
    isFetching,
  } = useFetchInternalIncomingLettersOutByIdQuery(outId);

  return (
    <>
      {isFetching ? (
        <Loading />
      ) : isSuccess ? (
        <OutcomingNewCreate new={false} entry={outcomingLetterList} />
      ) : (
        <SWRError />
      )}
    </>
  );
};
