import { Modal } from "./Modal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const acceptedFileTypes: string[] = ["pdf"];

function AcceptedFileTypesModal({ isOpen, onClose }: Props) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Accepted File Types"
      body={acceptedFileTypes.join(", ")}
    />
  );
}

export default AcceptedFileTypesModal;
