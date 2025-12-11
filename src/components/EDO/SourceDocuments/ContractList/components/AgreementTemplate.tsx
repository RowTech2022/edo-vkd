import { Box } from "@mui/material";
import { Card } from "@ui";
import { FC } from "react";

interface IAgreementTemplate {
  data: "work" | "buy";
}
export const AgreementTemplate: FC<IAgreementTemplate> = ({ data }) => {
  return (
    <Card title="Шаблон договора">
      <div className="tw-p-4">
        <Box>
          <object
            data={`/${data}.pdf`}
            type="application/pdf"
            width="100%"
            height="500px"
          >
            <p>
              Alternative text - include a link{" "}
              <a href={`/${data}.pdf`}>to the PDF!</a>
            </p>
          </object>
        </Box>
      </div>
    </Card>
  );
};
