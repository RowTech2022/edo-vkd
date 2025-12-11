import { SWRError, Loading } from "@ui";
import { useParams } from "react-router";
import { useEffect } from "react";
import { useLazyFetchLettersV4ByIdQuery } from "@services/lettersApiV4";
import { IntcomingCreateV4 } from "@components";

export const LettersV4IncomingShowPage = () => {
  const params = useParams();

  const incomingLetterId = parseInt(params.id as string);

  const [fetchData, { data: incomingLetterList, isSuccess, isFetching }] =
    useLazyFetchLettersV4ByIdQuery();

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
        <IntcomingCreateV4
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
