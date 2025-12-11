import { SWRError , Loading } from "@ui";
import CorIncomingCreateV35 from "@root/components/EDO/LettersV3.5/ExternalCorrespondence/Incoming/create";
import { useParams } from "react-router";
import { useEffect } from "react";
import { useLazyFetchLettersV3ByIdQuery } from "@services/lettersApiV3";

export const LettersV35ExternalCorIncomingShowPage = () => {
  const params = useParams();

  const incomingLetterId = parseInt(params.id as string);

  const [fetchData, { data: incomingLetterList, isSuccess, isFetching }] =
    useLazyFetchLettersV3ByIdQuery();

  const refetchData = () => {
    fetchData(incomingLetterId);
  };

  useEffect(() => {
    fetchData(incomingLetterId);
  }, [incomingLetterId]);

  return (
    <>
      {isFetching ? (
        <Loading />
      ) : isSuccess ? (
        <CorIncomingCreateV35
          entry={incomingLetterList}
          refetchData={refetchData}
          short
        />
      ) : (
        <SWRError />
      )}
    </>
  );
};
