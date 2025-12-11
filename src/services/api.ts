import { AxiosError, AxiosRequestConfig } from "axios";
import { BaseQueryFn } from "@reduxjs/toolkit/dist/query";
import { createApi } from "@reduxjs/toolkit/query/react";
import { addError } from "../store/slices/snackbarSlice";
import { store } from "../store";
import { IncomingFolder } from "./lettersNewApi";
import { axios } from "@configs";

export interface IQueryArgs {
  url: string;
  method?: AxiosRequestConfig["method"];
  data?: AxiosRequestConfig["data"];
  params?: AxiosRequestConfig["params"];
}

export interface IRequestPagination {
  pageInfo?: {
    pageNumber?: number;
    pageSize?: number;
  };
}

export interface IUserWithAvatar extends ValueId {
  avatar?: string;
}

export interface ValueId {
  id: string | number;
  value: string;
}

export interface ValueIdWithPosition extends ValueId {
  positionName?: string;
}

export interface IRequestOrderBy {
  orderBy?: {
    column?: number;
    order?: number;
  };
}

export interface ListResponse<T> {
  folderInfo?: IncomingFolder[];
  items: T[];
  total?: number;
  transition?: {
    buttonSettings: any;
  };
}

export interface ListResponse2<T> {
  items: T[];
  total?: number;
  folderInfo: {
    folderInfo: { id?: number; name: string };
    active: boolean;
    count?: number;
  }[];
}

const baseQuery =
  (): BaseQueryFn<IQueryArgs> =>
  async ({ url, method = "GET", data, params }) => {
    try {
      const response = await axios({ url, method, data, params });
      return {
        data: response.data,
      };
    } catch (axiosError) {
      let err = axiosError as AxiosError;
      store.dispatch(
        addError({
          error: {
            message: err.response?.data.Message || err.message,
          },
        })
      );
      return {
        error: {
          status: err.code,
          data: err.response?.data || err.message,
        },
      };
    }
  };

export const api = createApi({
  reducerPath: "mainApi",
  baseQuery: baseQuery(),
  endpoints: () => ({}),
  tagTypes: [
    "TFMISAccessApplication",
    "MFAccessForm",
    "SignaturesCard",
    "AccountantJobResponsibility",
    "Contracts",
    "Invoices",
    "Proxies",
    "Waybills",
    "TravelExpenses",

    "Incoming",
    "IncomingNew",
    "IncomingV3Chat",
    "Activity",
    "Outcoming",
    "Acts",
  ],
});
