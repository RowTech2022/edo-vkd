import { SignatureSample } from "@components";
import { SWRError , Loading } from "@ui";
import { useParams } from "react-router";
import { useFetchSignaturesSampleCardByIdQuery } from "@services/signatureCardApi";

export const SignaturesSampleCardShowPage = () => {
  const params = useParams();
  const signatureId = parseInt(params.id as string);
  const {
    data: application = {} as SignatureSamples.Card,
    isSuccess,
    isFetching,
  } = useFetchSignaturesSampleCardByIdQuery(signatureId);

  return (
    <>
      {isFetching ? (
        <Loading />
      ) : isSuccess ? (
        <SignatureSample new={false} entry={application} />
      ) : (
        <SWRError />
      )}
    </>
  );
};
