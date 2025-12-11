import AddTaskIcon from "@mui/icons-material/AddTask";
import AttachEmailIcon from "@mui/icons-material/AttachEmail";
import CalculateIcon from "@mui/icons-material/Calculate";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import DescriptionIcon from "@mui/icons-material/Description";
import EmailIcon from "@mui/icons-material/Email";
import HelpIcon from "@mui/icons-material/Help";
import MailLockIcon from "@mui/icons-material/MailLock";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import GroupsIcon from "@mui/icons-material/Groups";
import TopicIcon from "@mui/icons-material/Topic";
import SystemUpdateAltIcon from "@mui/icons-material/SystemUpdateAlt";

export const getModuleIcon = (name: string) => {
  switch (name) {
    case "documents":
      return <TopicIcon />;
    case "source-documents":
      return <DescriptionIcon />;
    case "latters":
      return <EmailIcon />;
    case "latters-v3":
      return <AttachEmailIcon />;
    case "finance-report":
      return <CalculateIcon />;
    case "eGov":
      return <AddTaskIcon />;
    case "egovFull":
      return <DesignServicesIcon />;
    case "letters-v3.5":
      return <SystemUpdateAltIcon />;

    case "letters-v4":
      return <MailLockIcon />;
    case "requestsmodul":
      return <HelpIcon />;
    case "crm":
      return <GroupsIcon />;
    default:
      return <PrivacyTipIcon />;
  }
};
