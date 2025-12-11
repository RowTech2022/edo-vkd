import React from "react";
import { useNavigate } from "react-router/dist";
import { Header } from "@ui";

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Header />
      <div>
        <img className="tw-w-[100%]" src="/images/notFound.png" alt="" />
      </div>
      <div className="tw-text-center tw-mt-[40px]">
        <p className="tw-tetx-[14px] tw-font-[400]">
          Запрашиваемая вами страница не найдена.
        </p>
        <p className="tw-text-[14px] tw-font-[700] tw-mt-[16px]">
          Перейдите на главную страницу сайта
        </p>
        <button
          onClick={() => navigate("/users/me/profile")}
          className="tw-w-[280px] tw-h-[48px] tw-tetx-[18px] tw-font-[700] tw-rounded-[26px] tw-bg-[#607D8B] tw-text-[white] tw-mt-[22px]"
        >
          На главную
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
