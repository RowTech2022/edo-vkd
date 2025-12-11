import React from "react";
import { Dialog } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import DocumentPdf from "./DocumentPdf";

function ShowConclusionFile({ files, visible, setVisible }) {
  return (
    <Dialog
      maxWidth="xl"
      open={visible}
      onClose={() => setVisible(false)}
      sx={{
        "& .MuiPaper-root": { maxWidth: "90%", width: "700px" },
      }}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0.2)", // затемнённый фон
            backdropFilter: "blur(8px)", // эффект размытия
          },
        },
      }}
    >
      <div>
        <Swiper
          pagination={{
            type: "bullets",
          }}
          navigation={true}
          modules={[Pagination, Navigation]}
          className="mySwiper"
        >
          {files?.map((el: any, i: number) => {
            return (
              <SwiperSlide key={`file-${i + 1}`}>
                <div className="swiper-no-swiping">
                  <DocumentPdf url={el} />
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </Dialog>
  );
}

export default ShowConclusionFile;
