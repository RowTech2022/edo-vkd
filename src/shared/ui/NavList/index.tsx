import { Box, Card, IconButton, Typography } from "@mui/material";
import { createRef, FC, RefObject, useState } from "react";
import style from "./index.module.scss";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";

interface INavState {
  chapterName: string;
  subchapterName: string;
}

interface INavRow {
  items: IChapters["items"];
  activeChapterId: number;
  layer: string;
  scrollButton?: boolean;
  onClick: (chapter: number, layer: string) => void;
}

export const NavRow: FC<INavRow> = ({
  items,
  activeChapterId,
  layer,
  scrollButton,
  onClick,
}) => {
  const boxRef: RefObject<HTMLDivElement> = createRef();
  const [scroll, setScroll] = useState(0);
  const step = 400;

  const handleScroll = (stepOrient: 1 | -1) => {
    let newScroll = scroll + step * stepOrient;
    if (boxRef.current) {
      const maxStep = boxRef.current.scrollWidth - boxRef.current.clientWidth;
      if (newScroll > maxStep) {
        newScroll = maxStep;
      } else if (newScroll < 0) {
        newScroll = 0;
      }
      boxRef.current.scrollTo({ left: newScroll, behavior: "smooth" });
    }
    setScroll(newScroll);
  };

  return (
    <>
      {scrollButton && (
        <Box sx={{ paddingRight: "10px" }}>
          <IconButton onClick={() => handleScroll(-1)}>
            <KeyboardArrowLeftIcon />
          </IconButton>
        </Box>
      )}
      <Box position={"relative"} width="80%" overflow="hidden">
        <Box
          ref={boxRef}
          className={style["hide-scrollbar"]}
          sx={{
            display: "flex",
            columnGap: "1rem",
            overflowX: "auto",
            alignItems: "center",
            height: "100%",
            position: "relative",
          }}
        >
          {items &&
            items.map((item) => {
              const activeClass =
                item.id === activeChapterId ? style.active : "";
              return (
                <Box
                  className={style["nav-button"] + " " + activeClass}
                  onClick={() => onClick(item.id, layer)}
                  key={item.name}
                >
                  {item.name}
                </Box>
              );
            })}
        </Box>
        {scrollButton && <div className={style.overlay} />}
      </Box>
      {scrollButton && (
        <Box sx={{ paddingLeft: "10px" }}>
          <IconButton onClick={() => handleScroll(1)}>
            <KeyboardArrowRightIcon />
          </IconButton>
        </Box>
      )}
    </>
  );
};

interface INavList {
  items: IChapters["items"];
  onChange: (chapterId: number) => void;
}

export const NavList: FC<INavList> = ({ items, onChange }) => {
  const [active, setActive] = useState<any>({});

  const { topLayer, bottomLayer } = active;
  const subchapters =
    topLayer && items.find((item) => item.id === topLayer)?.subTers;

  const handleClick = (chapter: number, chapterLayer: string) => {
    active[chapterLayer] = chapter;
    if (chapterLayer === "topLayer") {
      const sub = items?.find((item) => item.id === chapter)?.subTers;
      if (sub && sub.length > 0) {
        active.bottomLayer = sub[0].id;
      }
    }
    onChange(bottomLayer);
    setActive({ ...active });
  };

  return (
    <Card sx={{ marginY: "1rem" }}>
      <Box padding={2}>
        <Box display={"flex"} alignItems="center" marginTop={2}>
          <Typography sx={{ marginRight: "1rem" }} variant="subtitle1">
            Область:
          </Typography>
          <NavRow
            items={items}
            activeChapterId={topLayer}
            layer="topLayer"
            onClick={handleClick}
          />
        </Box>

        <Box display={"flex"} alignItems="center" marginTop={2}>
          <Typography sx={{ marginRight: "1rem" }} variant="subtitle1">
            Районы:
          </Typography>
          {subchapters && (
            <NavRow
              items={subchapters}
              activeChapterId={bottomLayer}
              layer="bottomLayer"
              scrollButton={true}
              onClick={handleClick}
            />
          )}
        </Box>
      </Box>
    </Card>
  );
};
