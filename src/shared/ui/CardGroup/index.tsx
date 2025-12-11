import { Box, Typography } from "@mui/material";
import { FC, ReactNode } from "react";

interface ICardGroup {
  title: string;
  children?: ReactNode;
}

export const CardGroup: FC<ICardGroup> = ({ title, children }) => {
  return (
    <Box
      sx={{
        paddingX: "15px",
        paddingY: "25px",
        border: "1px solid #ddd",
        position: "relative",
        marginY: "35px",
      }}
    >
      <Typography
        fontSize="20px"
        fontWeight={500}
        sx={{
          position: "absolute",
          top: "0",
          left: "10px",
          transform: "translateY(-70%)",
          background: "#fff",
          paddingX: "10px",
        }}
      >
        {title}
      </Typography>
      <Box>{children}</Box>
    </Box>
  );
};
