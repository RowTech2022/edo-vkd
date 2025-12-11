import styled from "@emotion/styled";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";

interface ModalFormProps {
  open: boolean;
  onToggle: () => void;
  refreshDataTable: () => void;
}

export interface CreateFolderProps {
  name: string;
}

export const StyledCard = styled(Card)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 300px;
  width: 400px;
  max-width: 400px;
  border-radius: 30px;
`;
export const StyledCardHeader = styled(CardHeader)`
  margin-bottom: 10px;
  background-color: #607d8b;

  .MuiTypography-root {
    color: white;
    font-size: 16px;
  }
`;
