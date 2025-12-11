import { SWRError , Loading } from "@ui";
import IncomingCreateV3 from "@root/components/EDO/LettersV3/Incoming/create";
import { useParams } from "react-router";
import { useEffect } from "react";
import { useLazyFetchLettersV3ByIdQuery } from "@services/lettersApiV3";

export const LettersV3IncomingShowPage = () => {
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
        <IncomingCreateV3
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
