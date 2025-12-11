import { SWRError, Loading } from "@ui";
import { OutcomingCreateV3 } from "@components";
import { useParams } from "react-router";
import { useFetchOutcomingV3ByIdQuery } from "@services/outcomingApiV3";

export const LettersV4OutcomingShowPage = () => {
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
        <OutcomingCreateV3 new={false} entry={outcomingLetterList} />
      ) : (
        <SWRError />
      )}
    </>
  );
};
