import { FC, useState } from "react";
import { Box, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

interface ICusotmAccordion {
  title: string;
  subtitle: string;
  children?: React.ReactNode;
}

export const CustomAccordion: FC<ICusotmAccordion> = ({
  title,
  subtitle,
  children,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Box
      sx={{
        overflow: "hidden",
        transition: "max-height .3s ease",
        maxHeight: open ? "400px" : "30px",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography
          variant="body2"
          textTransform="capitalize"
          fontWeight="600"
          paddingRight="16px"
          fontSize="17px"
          color="#424242"
        >
          <Box
            onClick={() => setOpen(!open)}
            sx={{
              marginRight: "5px",
              display: "inline-block",
              minHeight: "30px",
              cursor: "pointer",
            }}
          >
            {open ? (
              <RemoveIcon fontSize="small" />
            ) : (
              <AddIcon fontSize="small" />
            )}
          </Box>
          {title}:
          <Typography
            marginLeft="16px"
            display="inline-block"
            fontSize="17px"
            variant="subtitle1"
            color="#9e9e9e"
          >
            {subtitle}
          </Typography>
        </Typography>
      </Box>
      <Box paddingLeft="42px">{children}</Box>
    </Box>
  );
};
