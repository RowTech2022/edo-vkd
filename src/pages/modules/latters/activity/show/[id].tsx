import { ActivityCreate } from "@components";
import { SWRError , Loading } from "@ui";
import { useParams } from "react-router";
import { useFetchActivityByIdQuery } from "@services/activityApi";

export const LettersActivityShowPage = () => {
  const params = useParams();
  const mfAccessFormId = parseInt(params.id as string);

  const {
    data: data,
    isSuccess,
    isFetching,
  } = useFetchActivityByIdQuery(mfAccessFormId);

  return (
    <>
      {isFetching ? (
        <Loading />
      ) : isSuccess ? (
        <ActivityCreate entry={data} />
      ) : (
        <SWRError />
      )}
    </>
  );
};
