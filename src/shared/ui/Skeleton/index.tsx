import { Box, Skeleton } from "@mui/material";
import { FC } from "react";

interface ICustomSkeleton {
  containerWidth?: string;
  height?: string;
  width?: string;
  widthPatterns?: string[];
  heightPatterns?: string[];
  gap?: string;
  row?: number;
  isLoading: boolean;
  children: React.ReactNode;
}

export const CustomSkeleton: FC<ICustomSkeleton> = ({
  containerWidth = "100px",
  height = "40px",
  width = "100%",
  widthPatterns = [],
  heightPatterns = [],
  gap = "10px",
  row = 1,
  isLoading,
  children,
}): JSX.Element => {
  if (!isLoading) return <>{children}</>;

  return (
    <Box
      display="flex"
      sx={{ flexDirection: "column", gap, minWidth: containerWidth }}
    >
      {Array.from(Array(row).keys()).map((item) => {
        let heightInner = height;
        if (heightPatterns && heightPatterns[item]) {
          heightInner = heightPatterns[item];
        }
        let widthInner = width;
        if (widthPatterns && widthPatterns[item]) {
          widthInner = widthPatterns[item];
        }
        return <Skeleton key={item} height={heightInner} width={widthInner} />;
      })}
    </Box>
  );
};

export default CustomSkeleton;
