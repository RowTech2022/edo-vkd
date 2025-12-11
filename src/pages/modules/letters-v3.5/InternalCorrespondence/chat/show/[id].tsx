import { SWRError , Loading } from "@ui";
import InternalCreateV3_5 from "@root/components/EDO/LettersV3.5/InternalCorrespondence/Email/create";
import { useParams } from "react-router";
import { useEffect } from "react";
import { useLazyFetchLettersEmailByIdQuery } from "@services/lettersApiV35";

export const LettersV35InternalChatShowPage = () => {
  const params = useParams();

  const InternalEmailId = parseInt(params.id as string);

  const [fetchData, { data: incomingLetterList, isSuccess, isFetching }] =
    useLazyFetchLettersEmailByIdQuery();

  const refetchData = () => {
    fetchData(InternalEmailId);
  };

  useEffect(() => {
    fetchData(InternalEmailId);
  }, [InternalEmailId]);

  return (
    <>
      {isFetching ? (
        <Loading />
      ) : isSuccess ? (
        <InternalCreateV3_5
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
