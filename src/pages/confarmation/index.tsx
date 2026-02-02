import React, { useEffect, useState } from "react";
import { getConfirmationDetail } from "./api";
import { useParams } from "react-router-dom";
import DocumentPdf from "./DocumentPdf";
import { Avatar, Drawer, IconButton, Link, Typography, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import "./styles.css";

const Confarmation = () => {
  const applicationId = useParams();
  const [item, setItem] = useState<any>({
    docNumber: "",
    title: "",
    date: "",
    organisationName: "",
    signer: "",
    executor: "",
    sertIssuedBy: "",
    sertValid: null,
    finalFormUrl: "",
    attachments: [],
  });

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const fetchData = async (id: string) => {
    try {
      const resp = await getConfirmationDetail(id);
      setItem(resp);
    } catch (err) {
      console.error("Ошибка при получении данных:", err);
    }
  };

  useEffect(() => {
    if (applicationId?.id) {
      fetchData(applicationId.id);
    }
  }, [applicationId]);

  const formatDate = (dateValue: string | Date | null | undefined) => {
    if (!dateValue) return "";
    const date = typeof dateValue === "string" ? new Date(dateValue) : dateValue;
    if (isNaN(date.getTime())) return "";
    const months = [
      "янв", "фев", "мар", "апр", "май", "июн",
      "июл", "авг", "сен", "окт", "ноя", "дек"
    ];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const sidebarContent = (
    <div className="tw-h-full tw-bg-white tw-overflow-y-auto">
      {/* Document Metadata */}
      <div className="tw-px-6 tw-pt-6 tw-pb-4">
        {/* Первые 4 поля без заголовков - меньший интервал */}
        <div className="tw-space-y-3 tw-mb-6 tw-pb-6 tw-border-b tw-border-gray-200">
          {/* 1. DocNumber - без заголовка */}
          <div>
            <Typography variant="h5" className="tw-font-bold tw-text-gray-900">
              {item.docNumber || applicationId?.id || "N/A"}
            </Typography>
          </div>

          {/* 2. Title - без заголовка */}
          <div>
            <Typography variant="body1" className="tw-font-medium tw-text-gray-900">
              {item.title || "Название документа"}
            </Typography>
          </div>

          {/* 3. Date - без заголовка */}
          {item.date && (
            <div>
              <Typography variant="body2" className="tw-text-gray-900">
                {formatDate(item.date)}
              </Typography>
            </div>
          )}

          {/* 4. OrganisationName - без заголовка */}
          <div>
            <Typography variant="body2" className="tw-text-gray-900">
              {item.organisationName || "Не указан"}
            </Typography>
          </div>
        </div>

        {/* Остальные поля с заголовками - обычный интервал */}
        <div className="tw-space-y-6">
          {/* 5. Signer */}
          <div className="tw-pb-6 tw-border-b tw-border-gray-200">
            <Typography variant="caption" className="tw-text-gray-500 tw-block tw-mb-1">
              Кем подписан
            </Typography>
            <Typography variant="body2" className="tw-text-gray-900">
              {item.signer || "Не указан"}
            </Typography>
          </div>

          {/* 6. Executor */}
          <div className="tw-pb-6 tw-border-b tw-border-gray-200">
            <Typography variant="caption" className="tw-text-gray-500 tw-block tw-mb-1">
              Исполнитель
            </Typography>
            <Typography variant="body2" className="tw-text-gray-900">
              {item.executor || "Не указан"}
            </Typography>
          </div>

          {/* 7. SertIssuedBy */}
          <div className="tw-pb-6 tw-border-b tw-border-gray-200">
            <Typography variant="caption" className="tw-text-gray-500 tw-block tw-mb-1">
              Провайдер ЭП
            </Typography>
            <Typography variant="body2" className="tw-text-gray-900">
              {item.sertIssuedBy || "Не указан"}
            </Typography>
          </div>

          {/* 8. SertValid */}
          <div className="tw-pb-6 tw-border-b tw-border-gray-200">
            <Typography variant="caption" className="tw-text-gray-500 tw-block tw-mb-1">
              Срок действия ЭП
            </Typography>
            <Typography variant="body2" className="tw-text-gray-900">
              {item.sertValid ? formatDate(item.sertValid) : "Не указан"}
            </Typography>
          </div>

          {/* 9. FinalFormUrl */}
          <div className="tw-pb-6 tw-border-b tw-border-gray-200">
            <Typography variant="caption" className="tw-text-gray-500 tw-block tw-mb-2">
              Подписанный документ
            </Typography>
            {item.finalFormUrl ? (
              <Link
                href={item.finalFormUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="tw-text-blue-600 hover:tw-text-blue-800 tw-text-sm tw-flex tw-items-center tw-gap-1"
              >
                <InsertDriveFileIcon sx={{ fontSize: 16 }} />
                {item.docNumber ? `${item.docNumber}.pdf` : "Документ.pdf"}
              </Link>
            ) : (
              <Typography variant="body2" className="tw-text-gray-500">
                Не указан
              </Typography>
            )}
          </div>

          {/* 10. Attachments */}
          <div>
            <Typography variant="caption" className="tw-text-gray-500 tw-block tw-mb-2">
              Прикрепленные файлы
            </Typography>
            {item.attachments && item.attachments.length > 0 ? (
              <div className="tw-space-y-2">
                {item.attachments.map((attachment: any, index: number) => (
                  <Link
                    key={index}
                    href={attachment.url || attachment.fileUrl || attachment}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tw-text-blue-600 hover:tw-text-blue-800 tw-text-sm tw-flex tw-items-center tw-gap-1"
                  >
                    <InsertDriveFileIcon sx={{ fontSize: 16 }} />
                    {attachment.name || attachment.fileName || attachment.url?.split("/").pop() || `Файл ${index + 1}`}
                  </Link>
                ))}
              </div>
            ) : (
              <Typography variant="body2" className="tw-text-gray-500">
                Нет прикрепленных файлов
              </Typography>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="tw-min-h-screen tw-bg-gray-50">
      {/* Header with Burger Menu - Desktop and Mobile */}
      <div className="tw-bg-white tw-shadow-sm tw-sticky tw-top-0 tw-z-50 tw-border-b tw-border-gray-200">
        <div className="tw-flex tw-items-center tw-justify-between tw-px-4 tw-py-3">
          <IconButton
            onClick={() => {
              if (window.innerWidth >= 768) {
                setSidebarOpen(!sidebarOpen);
              } else {
                setDrawerOpen(true);
              }
            }}
            size="large"
            sx={{ 
              padding: "10px",
              color: "#374151",
              minWidth: "48px",
              minHeight: "48px",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.06)"
              },
              "&:active": {
                backgroundColor: "rgba(0, 0, 0, 0.1)"
              }
            }}
            aria-label="Открыть/закрыть меню"
          >
            <MenuIcon fontSize="large" sx={{ fontSize: "28px" }} />
          </IconButton>
          <div className="tw-flex tw-items-center tw-gap-5 tw-flex-1 tw-justify-center">
            <img 
              src="/log_2.png" 
              alt="Логотип" 
              className="tw-w-16 tw-h-16"
            />
            <div className="tw-flex tw-flex-col tw-items-center">
              <Typography variant="body2" className="tw-font-medium tw-text-gray-900">
                Вазорати молияи
              </Typography>
              <Typography variant="body2" className="tw-font-bold tw-text-gray-900">
                Ҷумҳурии Тоҷикистон
              </Typography>
            </div>
          </div>
          <div className="tw-w-12" /> {/* Spacer for symmetry */}
        </div>
      </div>

      {/* Main Content */}
      <div className="tw-flex tw-h-[calc(100vh-64px)]">
        {/* Desktop Sidebar */}
        <aside className={`tw-hidden md:tw-block tw-bg-white tw-shadow-sm tw-overflow-y-auto tw-transition-all tw-duration-300 tw-border-r tw-border-gray-200 ${
          sidebarOpen ? 'tw-w-80' : 'tw-w-0 tw-overflow-hidden'
        }`}>
          {sidebarOpen && sidebarContent}
        </aside>

        {/* Document Viewer */}
        <main className="tw-flex-1 tw-overflow-hidden tw-w-full md:tw-w-auto tw-p-0" style={{ backgroundColor: '#F1F5F9' }}>
          {item.finalFormUrl ? (
            <div className="tw-h-full tw-w-full tw-overflow-auto">
              <DocumentPdf url={item.finalFormUrl} />
            </div>
          ) : (
            <div className="tw-h-full tw-flex tw-items-center tw-justify-center">
              <Typography variant="body1" className="tw-text-gray-500">
                Документ не найден
              </Typography>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        ModalProps={{
          keepMounted: true,
        }}
        PaperProps={{
          sx: { 
            width: "85%", 
            maxWidth: 400,
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
          }
        }}
      >
        <div className="tw-relative tw-h-full">
          <div className="tw-sticky tw-top-0 tw-bg-white tw-z-20 tw-border-b tw-border-gray-200 tw-px-4 tw-py-3 tw-flex tw-items-center tw-justify-between">
            <Typography variant="h6" className="tw-font-semibold tw-text-gray-900">
              Информация о документе
            </Typography>
            <IconButton
              onClick={() => setDrawerOpen(false)}
              size="medium"
              sx={{ 
                padding: "8px",
                color: "#374151",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.06)"
                }
              }}
              aria-label="Закрыть меню"
            >
              <CloseIcon />
            </IconButton>
          </div>
          <div className="tw-overflow-y-auto tw-h-[calc(100%-64px)]">
            {sidebarContent}
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default Confarmation;
