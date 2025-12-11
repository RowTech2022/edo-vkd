import { Box, Button, IconButton, Modal, Typography } from "@mui/material";

import dayjs from "dayjs";
import React, { useEffect, useMemo, useState } from "react";
import Close from "@mui/icons-material/Close";
import {
  useUpdateTaskMutation,
  useUserTaskListMutation,
} from "@services/admin/rolesApi";
import CreateTask from "./CreateTask";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import EditTask from "./EditTask";
import { toast } from "react-toastify/dist";

interface Props {
  open: boolean;
  onClose: () => void;
  data: any;
  onTaskUpdated: () => void;
}

const ViewEvent = ({ open, onClose, data, onTaskUpdated }: Props) => {
  const [updateTask] = useUpdateTaskMutation();
  const [userTaskList] = useUserTaskListMutation();

  const dater = data?.data?.items[0]?.date;
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const [open2, setOpen2] = useState<boolean>(false);
  const [open3, setOpen3] = useState<boolean>(false);
  const [localData, setLocalData] = useState<any>(data);

  const getData = async (selectedDate?: string) => {
    try {
      const dateToSend = selectedDate || dayjs().format("YYYY-MM-DD");
      const sendDate = { date: dateToSend };
      const res = await userTaskList(sendDate);
      //@ts-ignore
      setLocalData(res.data);
    } catch (error) {
      console.error(error);
      toast("Произошла ошибка при загрузке событий.", {
        type: "error",
        position: "top-right",
      });
    }
  };

  const handleTaskUpdated = () => {
    getData();
  };

  const groupedByTime = useMemo(() => {
    const groups: { [key: string]: any[] } = {};
    localData?.data?.items?.forEach((event: any) => {
      const formattedTime = dayjs(
        `1970-01-01T${event.time.split(".")[0]}Z`
      ).format("HH:mm");
      if (!groups[formattedTime]) {
        groups[formattedTime] = [];
      }
      groups[formattedTime]?.push(event);
    });
    return groups;
  }, [localData]);

  useEffect(() => {
    setLocalData(data);
  }, [data, localData]);

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: 4,
            borderRadius: "8px",
            boxShadow: 24,
            maxHeight: "600px",
            overflowX: "auto",
            minWidth: "800px",
          }}
        >
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography sx={{ fontWeight: "600" }}>
                Просмотр события
              </Typography>
              <IconButton aria-label="close" onClick={onClose}>
                <Close />
              </IconButton>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "end", mb: 4 }}>
              <Button onClick={() => setOpen2(true)}>+ Добавить события</Button>
            </Box>
            <Box>
              {Object.entries(groupedByTime).map(([time, events], index) => (
                <div
                  key={index}
                  className="tw-w-[100%] tw-mt-4 hover:tw-bg-[#F2FAFE] tw-rounded-[14px] tw-p-2"
                >
                  <div className="tw-flex  tw-gap-3 tw-items-center tw-min-w-[400px]">
                    <div className="tw-font-bold tw-text-[14px] tw-text-[#000] ">
                      {time}
                    </div>

                    <div className="tw-flex tw-w-[100%] tw-gap-2">
                      {events.map((event, i) => (
                        <div
                          key={i}
                          className="tw-flex tw-items-start tw-justify-between  tw-cursor-pointer tw-rounded-[12px]  tw-p-3 tw-w-[100%]"
                        >
                          <div className="tw-w-[6px] tw-h-[40px] tw-rounded-[4px] tw-bg-gradient-to-b tw-from-[#A6C0FE] tw-to-[#F68084] tw-mr-3" />

                          <div className="tw-flex-1">
                            <p className="tw-font-semibold tw-text-[14px] tw-text-[#1A1A1A]">
                              {event.title}
                            </p>
                            <p className="tw-text-[13px] tw-text-[#909090] tw-truncate">
                              {event.description}
                            </p>
                          </div>
                          <div className="">
                            <IconButton
                              onClick={() => {
                                setSelectedEvent(event);
                                setOpen3(true);
                              }}
                              size="small"
                              className="tw-ml-2"
                            >
                              <ModeEditOutlineOutlinedIcon />
                            </IconButton>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </Box>
          </Box>
        </Box>
      </Modal>
      <CreateTask
        onTaskCreate={handleTaskUpdated}
        dater={dater}
        open={open2}
        onClose={() => setOpen2(false)}
      />
      <EditTask
        onTaskUpdated={handleTaskUpdated}
        data={selectedEvent}
        open={open3}
        onClose={() => setOpen3(false)}
      />
    </>
  );
};

export default ViewEvent;
