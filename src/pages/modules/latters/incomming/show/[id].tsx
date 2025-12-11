import { IncomingCreate } from "@components";
import { SWRError , Loading } from "@ui";
import { useParams } from "react-router";
import { useFetchInternalIncomingLettersInByIdQuery } from "@services/internal/incomingApi";

export const LettersIncomingShowPage = () => {
  const params = useParams();
  const incomingLetterId = parseInt(params.id as string);
  const {
    data: incomingLetterList,
    isSuccess,
    isFetching,
  } = useFetchInternalIncomingLettersInByIdQuery(incomingLetterId);

  return (
    <>
      {isFetching ? (
        <Loading />
      ) : isSuccess ? (
        <IncomingCreate
          entry={incomingLetterList}
          ansBod={incomingLetterList?.ansBody}
        />
      ) : (
        <SWRError />
      )}
    </>
  );
};
