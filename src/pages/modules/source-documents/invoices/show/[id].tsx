import { InvoiceList } from "@components";
import { SWRError , Loading } from "@ui";
import { useParams } from "react-router";
import { useFetchInvoiceByIdQuery } from "@services/invoiceApi";

export const DocumentsInvoicesShowPage = () => {
  const params = useParams();

  const invoiceId = parseInt(params.id as string);

  const {
    data: accountantJobRespsList,
    isSuccess,
    isFetching,
  } = useFetchInvoiceByIdQuery(invoiceId);

  return (
    <>
      {isFetching ? (
        <Loading />
      ) : isSuccess ? (
        <InvoiceList entry={accountantJobRespsList} />
      ) : (
        <SWRError />
      )}
    </>
  );
};
