import {
  HttpTransportType,
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import {
  Badge,
  Box,
  Button,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  useTheme,
  Grow,
} from "@mui/material";
import { FC, useEffect, useRef, useState } from "react";
import { useGetModuleBellQuery } from "@services/userprofileApi";
import { toast } from "react-toastify";
import { ScrollControll } from "@ui";
import { useNavigate } from "react-router";
import { useSession } from "@hooks";
import { useAppDispatch, useAppSelector } from "@root/store/hooks";
import { handleOpenOrClose } from "@root/store/slices/snackbarSlice";

const notificationsURL =
  (import.meta.env.VITE_PUBLIC_CHAT_URL || "/") + "NotificationUser_";

const getName = (data: string) => {
  try {
    const user = JSON.parse(data);
    return <span style={{ color: "#34d399" }}>{user.value || ""}</span>;
  } catch (err) {
    return "";
  }
};

export const Notifications: FC = () => {
  const { data, refetch } = useGetModuleBellQuery();
  // const [open, setOpen] = useState(false);
  const open = useAppSelector((state) => state.snackbar.notificationOpen);

  const [activeModule, setActiveModule] = useState(0);
  const [activeSubModule, setActiveSubModule] = useState(0);
  const session = useSession();
  const [connect, setConnect] = useState<HubConnection | null>(null);
  const navigate = useNavigate();
  const [update, setUpdate] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLDivElement>(null);
  const mode = useAppSelector((state) => state.snackbar.mode);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const userId = session.data?.user?.id;
    if (userId && !connect) {
      const connection = new HubConnectionBuilder()
        .withUrl(notificationsURL + userId, {
          skipNegotiation: true,
          transport: HttpTransportType.WebSockets,
        })
        .configureLogging(LogLevel.Information)
        .build();

      connection.on("ReceiveNotification", (data: any, eventName: string) => {
        if (eventName === "SignalForUser") {
          refetch();
          toast(<div>{getName(data)} Вас упомянули в чате!</div>, {
            type: "success",
            position: "top-right",
          });
        }
      });

      connection.onclose((e) => {
        console.log(999, "close");
      });

      connection
        .start()
        .then((res) => {
          console.log("ConnectionStart: ", res);
        })
        .catch((err: any) => {
          console.log("ConnectionError: ", err);
        });

      setConnect(connection);
    }

    return () => {
      if (connect) {
        connect.stop().then(() => {
          console.log("Connection closed manualy");
          setConnect(null);
        });
      }
    };
  }, [session.data]);

  const theme = useTheme();

  const modules = data?.modulDetails || [];

  const primaryColor = theme.palette.primary.main;

  const itemDetails =
    activeModule !== -1 &&
    modules &&
    activeSubModule !== -1 &&
    modules[activeModule]?.subModulDetails &&
    modules[activeModule]?.subModulDetails[activeSubModule]?.itemDetails;

  useEffect(() => {
    setTimeout(() => setUpdate(Math.random()), 400);
    if (open) {
      refetch();
    }
  }, [open]);

  return (
    <Box
      sx={{
        position: "fixed",
        right: "-2px",
        top: "calc(50% - 190px)",
        transform: "rotate(-90deg)",
        transformOrigin: "100% 100%",
        zIndex: 99999,
      }}
    >
      <Box>
        <Drawer
          anchor="top"
          open={open}
          onClose={() => dispatch(handleOpenOrClose(false))}
          BackdropProps={{ invisible: true }}
          //@ts-ignore
          TransitionComponent={Grow}
          transitionDuration={900}
          PaperProps={{
            sx: {
              top: "90px",
              width: "800px",
              height: "70vh",
              borderTopLeftRadius: 12,
              position: "fixed",
              right: 0,
              left: "50%",
              borderBottomLeftRadius: 12,
              overflow: "hidden",
              transformOrigin: "top center",
            },
          }}
          sx={{
            overflow: "auto",
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { boxSizing: "border-box" },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              // width: 'max(300px, 50%)',
              height: "100%",
            }}
          >
            <Box
              sx={{
                background: theme.palette.primary.main,
              }}
            >
              <Box
                sx={{
                  color: "#fff",
                  display: "flex",
                  gap: 2,
                  p: 1.5,
                  pb: 1,
                }}
              >
                <Typography variant="h5" fontWeight={500}>
                  Уведомления
                </Typography>
                <Badge
                  sx={{
                    "& .BaseBadge-badge": {
                      top: "16px",
                      right: "14px",
                      width: "16px",
                      height: "16px",
                      // background: activeModule !== idx ? 'red' : '#fff',
                      // color: activeModule !== idx ? '' : primaryColor,
                    },
                  }}
                  // key={idx}
                  // badgeContent={item.count}
                  color="secondary"
                >
                  {/* <Button
                    sx={{
                      px: 4,
                      color: '#fff',
                      fontSize: '12px',
                      borderRadius: 1,
                      background: '',
                      borderBottomLeftRadius: 0,
                      borderBottomRightRadius: 0,
                    }}
                    onClick={() => {

                    }}
                  > */}
                  {/* {item.modulName} */}
                  <Typography variant="h5" fontWeight={500}>
                    Новости
                  </Typography>
                  {/* </Button> */}
                </Badge>
              </Box>
              <Divider sx={{ background: "#fff", height: "1px" }} />
              <ScrollControll boxRef={ref} color="#48555b">
                <Box
                  className="no-scrollbar"
                  sx={{
                    overflow: "auto",
                  }}
                  mt={1}
                  ref={ref}
                >
                  <Badge
                    sx={{
                      "& .BaseBadge-badge": {
                        top: "16px",
                        right: "14px",
                        width: "16px",
                        height: "16px",
                        // background: activeModule !== idx ? 'red' : '#fff',
                        // color: activeModule !== idx ? '' : primaryColor,
                      },
                    }}
                    // key={idx}
                    // badgeContent={item.count}
                    color="secondary"
                  >
                    <Button
                      sx={{
                        px: 4,
                        color: "#fff",
                        fontSize: "12px",
                        borderRadius: 1,
                        background: "#4D636F !important",
                        borderBottomLeftRadius: 0,
                        borderBottomRightRadius: 0,
                      }}
                      // key={idx}
                      onClick={() => {
                        // setActiveModule(idx)
                        // setActiveSubModule(0)
                      }}
                    >
                      {/* {item.modulName} */}
                      Уведомления
                    </Button>
                  </Badge>
                  {/* <Badge
                    sx={{
                      '& .BaseBadge-badge': {
                        top: '16px',
                        right: '14px',
                        width: '16px',
                        height: '16px',
                      },
                    }}

                    color="secondary"
                  >
                    <Button
                      sx={{
                        px: 4,
                        color: '#fff',
                        fontSize: '12px',
                        borderRadius: 1,
                        background: '',
                        borderBottomLeftRadius: 0,
                        borderBottomRightRadius: 0,
                      }}
                      onClick={() => {

                      }}
                    >
                      Новости
                    </Button>
                  </Badge> */}

                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "nowrap",
                    }}
                  >
                    {modules &&
                      modules.map((item, idx) => (
                        <Badge
                          sx={{
                            "& .BaseBadge-badge": {
                              top: "16px",
                              right: "14px",
                              width: "16px",
                              height: "16px",
                              background: activeModule !== idx ? "red" : "#fff",
                              color: activeModule !== idx ? "" : primaryColor,
                            },
                          }}
                          key={idx}
                          badgeContent={item.count}
                          color="error"
                        >
                          <Button
                            sx={{
                              px: 4,
                              color: "#fff",
                              fontSize: "12px",
                              borderRadius: 1,
                              background:
                                activeModule === idx
                                  ? "#4D636F !important"
                                  : "",
                              borderBottomLeftRadius: 0,
                              borderBottomRightRadius: 0,
                            }}
                            key={idx}
                            onClick={() => {
                              setActiveModule(idx);
                              setActiveSubModule(0);
                            }}
                          >
                            {item.modulName}
                          </Button>
                        </Badge>
                      ))}
                  </Box>
                </Box>
              </ScrollControll>
              <ScrollControll boxRef={subRef} color="#3f505a">
                {activeModule !== -1 &&
                  modules &&
                  modules[activeModule]?.subModulDetails && (
                    <Box
                      className="no-scrollbar"
                      ref={subRef}
                      sx={{
                        overflow: "auto",
                        background: "#4D636F",
                        // position: 'relative',
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          flexWrap: "nowrap",
                          py: 1,
                          pl: 2,
                        }}
                      >
                        {modules[activeModule].subModulDetails.map(
                          (item, idx) => (
                            <Badge
                              sx={{
                                "& .BaseBadge-badge": {
                                  top: "14px",
                                  right: "16px",
                                  width: "16px",
                                  height: "16px",
                                  background:
                                    activeSubModule !== idx ? "red" : "#fff",
                                  color:
                                    activeSubModule !== idx ? "" : primaryColor,
                                },
                              }}
                              key={idx}
                              badgeContent={item.count}
                              color="error"
                            >
                              <Button
                                sx={{
                                  display: "inline-block",
                                  minWidth: "180px",
                                  fontSize: "10px",
                                  whiteSpace: "nowrap",
                                  color: "#fff",
                                  textOverflow: "ellipsis",
                                  overflow: "hidden",
                                  pr: 4,
                                  backgroundColor:
                                    activeSubModule === idx
                                      ? `${primaryColor} !important`
                                      : "",
                                }}
                                key={idx}
                                variant="outlined"
                                onClick={() => setActiveSubModule(idx)}
                              >
                                {item.subModulName}
                              </Button>
                            </Badge>
                          )
                        )}
                      </Box>
                    </Box>
                  )}
              </ScrollControll>
            </Box>
            <Box sx={{ flex: 1, overflow: "auto" }}>
              <Box
                height="100%"
                sx={{
                  bgcolor: mode === "dark" ? "#79798B" : "background.paper",
                }}
              >
                <List
                  sx={{
                    width: "100%",
                    minWidth: "100%",
                    maxWidth: 360,
                    paddingTop: "5px !important",
                  }}
                >
                  {itemDetails &&
                    itemDetails?.map((item, idx) => (
                      <ListItemButton
                        key={idx}
                        sx={{
                          backgroundColor: "#C5CED4",
                        }}
                        onClick={() => {
                          navigate("/" + item.modulRoute);
                          dispatch(handleOpenOrClose(false));
                        }}
                      >
                        <ListItemText
                          color="primary"
                          primary={item.displayName}
                          sx={{
                            color: "#222",

                            "& .MuiTypography-root": {
                              fontWeight: 500,
                            },
                          }}
                          //   secondary="Lorem ipsum dolor sit amet consectetur adipisicing elit."
                        />
                      </ListItemButton>
                    ))}
                </List>
              </Box>
            </Box>
          </Box>
        </Drawer>
      </Box>
    </Box>
  );
};
