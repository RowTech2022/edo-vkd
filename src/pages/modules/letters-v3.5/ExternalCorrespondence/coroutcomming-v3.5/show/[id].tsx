import { OutcomingCreateV3_5 } from "@components";
import { SWRError , Loading } from "@ui";
import { useParams } from "react-router";
import { useFetchOutcomingV3ByIdQuery } from "@services/outcomingApiV3";

export const LettersV35ExternalCorOutcomingShowPage = () => {
  const params = useParams();

  const outId = parseInt(params.id as string);
  const {
    data: outcomingLetterList,
    isSuccess,
    isFetching,
  } = useFetchOutcomingV3ByIdQuery(outId);

  return (
    <>
      {isFetching ? (
        <Loading />
      ) : isSuccess ? (
        <OutcomingCreateV3_5 new={false} entry={outcomingLetterList} />
      ) : (
        <SWRError />
      )}
    </>
  );
};
