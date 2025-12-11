import { Box, Typography } from "@mui/material";
import { FC } from "react";

interface IFact {
  name?: string | null;
  value?: string | number | null;
}

export const Fact: FC<IFact> = ({ name, value = "" }) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", minHeight: "32px" }}>
      <Typography
        variant="body2"
        textTransform="capitalize"
        fontWeight="600"
        paddingRight="16px"
        fontSize="17px"
        color="#424242"
      >
        {name}:
      </Typography>
      <Typography fontSize="17px" variant="subtitle1" color="#9e9e9e">
        {value}
      </Typography>
    </Box>
  );
};
