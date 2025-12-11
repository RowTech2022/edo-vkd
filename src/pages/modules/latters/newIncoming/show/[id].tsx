import { NewIncomingCreate } from "@components";
import { SWRError , Loading } from "@ui";
import { useParams } from "react-router";
import {
  // useFetchIncomingLettersQuery,
  useFetchLettersNewByIdQuery,
} from "@services/lettersNewApi";

export const LettersNewIncomingShowPage = () => {
  const params = useParams();

  const incomingLetterId = parseInt(params.id as string);

  const {
    data: incomingLetterList,
    isSuccess,
    isFetching,
  } = useFetchLettersNewByIdQuery(incomingLetterId);

  return (
    <>
      {isFetching ? (
        <Loading />
      ) : isSuccess ? (
        <NewIncomingCreate entry={incomingLetterList} />
      ) : (
        <SWRError />
      )}
    </>
  );
};
