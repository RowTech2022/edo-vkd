import { createRef, RefObject, useEffect, useState } from "react";
import { BellIcon } from "@ui";
import {
  NotificationsItemDetail,
  useFetchNotificationsMutation,
} from "@services/generalApi";
import {
  Badge,
} from "@mui/material";
import styles from "./index.module.scss";
import { documentRoutes } from "./constants";
import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "@root/store/hooks";
import { handleOpenOrClose } from "@root/store/slices/snackbarSlice";
import { useGetModuleBellQuery } from "@root/services";
import { useScreenSize } from "@hooks";


// miliseconds
const NOTIFICATIONS_UPDATE_TIME = 1800 * 1000; //30-мин

const PER_PAGE = 5;
export const Notifications = () => {
  const { width } = useScreenSize();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [data, setData] = useState<any>({});
  const { total, itemDetails } = data || 0;
  const [fetchNotifications] = useFetchNotificationsMutation();
  const myRef: RefObject<HTMLDivElement> = createRef();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const { data: notfications, refetch } = useGetModuleBellQuery();

  const notificationOpen = useAppSelector(
    (state) => state.snackbar.notificationOpen
  );

  const handleNotifications = (param: any) => {
    setPage(1);
    setLoading(true);
    setData(param);
    setLoading(false);
    // fetchNotifications()
    //   .then((res: any) => {
    //     setData(res.data);
    //     setLoading(false);
    //   })
    //   .finally(() => setLoading(false));
  };

  const handler = (e: any) => {
    if (e.target !== myRef.current && !myRef.current?.contains(e.target)) {
      setNotificationsOpen(false);
    }
  };

  useEffect(() => {
    if (notfications) {
      handleNotifications(notfications);
    }
  }, [notfications]);

  useEffect(() => {
    handleNotifications(notfications);
    const id = setInterval(() => {
      handleNotifications(notfications);
    }, NOTIFICATIONS_UPDATE_TIME);

    return () => clearInterval(id);
  }, [fetchNotifications]);

  const getToRoute = ({ type, id }: NotificationsItemDetail) => {
    if (documentRoutes[type as any]) {
      const path = documentRoutes[type as any] + id;
      setNotificationsOpen(false);
      navigate(path);
    }
  };

  const onPageChange = (e: any, page: number) => setPage(page);

  useEffect(() => {
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [myRef]);

  const classNames =
    styles["notifications-container"] +
    " " +
    (notificationsOpen ? styles["visible"] : styles["hidden"]);

  const startIdx = (page - 1) * PER_PAGE;
  const itemsToShow = itemDetails?.slice(startIdx, startIdx + PER_PAGE) || [];

  return (
    <div
      ref={myRef}
      className="tw-text-slate-400 tw-relative tw-cursor-pointer "
    >
      <div
        className="hover:tw-opacity-75"
        onClick={() => {
          setNotificationsOpen(!notificationsOpen);
          dispatch(handleOpenOrClose(!notificationOpen));
        }}
      >
        <Badge
          classes={{ badge: total > 0 ? styles.badgePulse : "" }}
          badgeContent={total}
          color="error"
          sx={{
            "& .MuiBadge-badge": {
              right: -18, 
              top: -10, 
            },
          }}
        >
          <BellIcon />
        </Badge>
      </div>
      {/* <Paper
      elevation={3}
      className={classNames}
      sx={{ overflow: 'hidden', borderRadius: '4px' }}
    >
      <Typography
        fontSize={'20px'}
        fontWeight={600}
        sx={{
          backgroundColor: '#eeeeee',
          color: '#424242',
          paddingY: '.7rem',
          paddingX: '1rem',
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        Уведомления
      </Typography>
      {itemDetails && itemDetails?.length > 0 && (
        <>
          <Box className={styles['list-scrollable']}>
            {itemsToShow?.map(
              (item: any, idx: React.Key | null | undefined) => (
                <ListItemButton onClick={() => getToRoute(item)} key={idx}>
                  <ListItemText primary={item.displayName} />
                </ListItemButton>
              )
            )}
          </Box>
          <Box display="flex" columnGap="15px" alignItems="center">
            <Pagination
              page={page}
              sx={{ marginY: 3, flexWrap: 'nowrap' }}
              onChange={onPageChange}
              count={Math.ceil(total / PER_PAGE)}
              shape="rounded"
            />
            <Box
              className={loading ? 'anim-rotate' : ''}
              width="40px"
              height="40px"
            >
              <IconButton onClick={handleNotifications}>
                <CachedIcon sx={{ color: '#9e9e9e' }} fontSize="medium" />
              </IconButton>
            </Box>
          </Box>
        </>
      )}
      {itemDetails && itemDetails?.length === 0 && (
        <Typography
          fontSize={'20px'}
          fontWeight={600}
          sx={{
            color: '#bdbdbd',
            paddingY: '.7rem',
            textAlign: 'center',
          }}
        >
          Нет новых уведомлений
        </Typography>
      )}
    </Paper> */}
    </div>
  );
};
