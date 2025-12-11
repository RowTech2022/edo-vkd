import { Box, Button, TextField } from "@mui/material";
import { CustomButton } from "@ui";
import { FC, useState } from "react";
import { ITabDetail, TabType } from "../interface";
import { transitionsAllowed } from "../utils";

const OPRK3: FC<ITabDetail> = (props) => {
  const {
    loginTfmis,
    passwordTfmis,
    loginEdo,
    passwordEdo,
    certNumber,
    date,
    loginVpn,
    passwordVpn,
  } = props.oprk3;
  const { handlers, id, transitions, loaderButtonId } = props;
  const [dateState, setDate] = useState(date);

  const { oprk3_print, oprk3_done } = transitions.buttonSettings || {};
  return (
    <div className="OPRK3">
      <Box display="flex" columnGap="15px" marginBottom="25px">
        <Button
          disabled
          type="button"
          color="warning"
          variant="contained"
          size="medium"
          onClick={() => {}}
          sx={{ fontWeight: 600, minWidth: "100px" }}
        >
          TFMIS
        </Button>
        <TextField
          value={loginTfmis}
          id="outlined-basic"
          label="Login"
          variant="outlined"
        />
        <TextField
          value={passwordTfmis}
          id="outlined-basic"
          label="Пароль"
          variant="outlined"
          type="password"
        />
      </Box>
      <Box display="flex" columnGap="15px" marginBottom="25px">
        <Button
          disabled
          type="button"
          color="warning"
          variant="contained"
          size="medium"
          onClick={() => {}}
          sx={{ fontWeight: 600, minWidth: "100px" }}
        >
          EDO
        </Button>
        <TextField
          value={loginEdo}
          id="outlined-basic"
          label="Login"
          variant="outlined"
        />
        <TextField
          value={passwordEdo}
          id="outlined-basic"
          label="Пароль"
          variant="outlined"
          type="password"
        />
      </Box>
      <Box display="flex" columnGap="15px" marginBottom="25px">
        <TextField
          value={certNumber}
          id="outlined-basic"
          label="Серия"
          variant="outlined"
        />
        <TextField
          value={dateState}
          onChange={(event) => setDate(event.target.value)}
          id="date"
          label="Birthday"
          type="date"
          defaultValue="2017-05-24"
          sx={{ width: 220 }}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Box>
      <Box display="flex" columnGap="15px">
        <Button
          disabled
          type="button"
          color="primary"
          variant="contained"
          size="medium"
          onClick={() => {}}
          sx={{ fontWeight: 600, minWidth: "100px" }}
        >
          VPN
        </Button>
        <TextField
          value={loginVpn}
          id="outlined-basic"
          label="Login"
          variant="outlined"
        />
        <TextField
          value={passwordVpn}
          id="outlined-basic"
          label="Пароль"
          variant="outlined"
          type="password"
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          columnGap: "20px",
          marginTop: "32px",
          marginRight: "100px",
          justifyContent: "end",
          height: "44px",
        }}
      >
        <Button
          type="button"
          color="success"
          variant="contained"
          size="medium"
          disabled={transitionsAllowed(oprk3_print?.readOnly)}
          onClick={() => {}}
          sx={{ fontWeight: 600, minWidth: "100px" }}
        >
          Печать
        </Button>
        <CustomButton
          type="button"
          color="info"
          variant="contained"
          size="medium"
          loading={"oprk3_done" === loaderButtonId}
          disabled={transitionsAllowed(oprk3_done?.readOnly)}
          onClick={() =>
            handlers.modifyRequest("setDone", id, TabType.OPRK3, "oprk3_done")
          }
          sx={{ fontWeight: 600, minWidth: "100px" }}
        >
          Звершить
        </CustomButton>
      </Box>
    </div>
  );
};

export default OPRK3;
