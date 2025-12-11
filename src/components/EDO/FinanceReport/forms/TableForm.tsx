import { TextField ,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { FormikProps } from "formik";
import { FC , useEffect, useState } from "react";
import { Card } from "@ui";

import { useLazyFetchMetaDataQuery } from "@services/financeReport";
import { IMetaData } from "@services/financeReport/models/metadata";
import { deepCopy } from "@utils";
import { useParams } from "react-router";

interface ITableForm {
  formik: FormikProps<any>;
}

export const TableForm: FC<ITableForm> = ({ formik }) => {
  const params = useParams();
  const isFormUpdating = Boolean(params.id);
  const [currentData, setCurrentData] = useState<IMetaData[]>([]);
  const [metaDataInfo, { isFetching: isFetchHead }] =
    useLazyFetchMetaDataQuery();
  const { values, setFieldValue } = formik;
  const [reportTypeId, setReportTypeId] = useState("");
  const [metaData, setMetaData] = useState<any>(null);

  const SetDependValue = (
    accum: IMetaData[],
    depends: string[],
    isStartCell: boolean
  ) => {
    depends.forEach(function (depend) {
      let dependIndex = accum.findIndex((item) => item.code === depend);
      var starCells = isStartCell
        ? accum[dependIndex]?.startDependCodes
        : accum[dependIndex]?.endDependCodes;
      if (starCells !== null) {
        let allS2 = 0;
        starCells?.forEach(function (startCell) {
          if (startCell.startsWith("-")) {
            let valIndex2 = accum.findIndex(
              (item) => item.code === startCell.substring(1)
            );
            let forAdd = isStartCell
              ? accum[valIndex2].startSum || 0
              : accum[valIndex2].endSum || 0;
            allS2 = allS2 - forAdd;
          } else {
            let valIndex2 = accum.findIndex((item) => item.code === startCell);
            let forAdd = isStartCell
              ? accum[valIndex2]?.startSum || 0
              : accum[valIndex2]?.endSum || 0;
            allS2 = allS2 + forAdd;
          }
        });
        if (isStartCell)
          accum[dependIndex] = { ...accum[dependIndex], startSum: allS2 };
        else accum[dependIndex] = { ...accum[dependIndex], endSum: allS2 };
        var secDepends = accum[dependIndex].dependCodes;
        if (secDepends != null) SetDependValue(accum, secDepends, isStartCell);
      }
    });
  };

  const changeItemValue = (
    code: string,
    firstDepend: string[],
    startFormula: string[],
    endFormula: string[],
    value: string,
    isStartCell: boolean
  ) => {
    let indexToUpdate = currentData.findIndex((item) => item.code === code);
    let newArr = [...currentData];
    if (isStartCell)
      newArr[indexToUpdate] = {
        ...newArr[indexToUpdate],
        startSum: Number(value),
      };
    else
      newArr[indexToUpdate] = {
        ...newArr[indexToUpdate],
        endSum: Number(value),
      };

    if (firstDepend !== null) SetDependValue(newArr, firstDepend, isStartCell);

    setCurrentData(newArr);
    setFieldValue("reportDetails.items", newArr);
  };

  useEffect(() => {
    metaDataInfo().then((data: any) => {
      setMetaData(data.data);
    });
  }, [metaDataInfo]);

  const setDataByReportType = (reportType: string) => {
    if (metaData) {
      const items = metaData?.reportInfo[reportType || ""];

      setCurrentData(deepCopy(items) || []);
      setFieldValue("reportDetails.items", items || []);
    }
  };

  useEffect(() => {
    if (
      isFormUpdating &&
      values.reportType &&
      values.reportDetails &&
      !currentData.length
    ) {
      setCurrentData(
        values.reportDetails?.items ? deepCopy(values.reportDetails?.items) : []
      );
      setReportTypeId(values.reportType.id);
    } else if (values.reportType && values.reportType.id !== reportTypeId) {
      setDataByReportType(values.reportType.id);
      setReportTypeId(values.reportType.id);
    }
  }, [
    values.reportDetails,
    values.reportType,
    currentData,
    reportTypeId,
    setDataByReportType,
    isFormUpdating,
  ]);

  const changeItem = (item: any, key: string, value: string) => {
    item[key] = Number(value);

    item.total =
      (item.uc || 0) +
      (item.dc || 0) +
      (item.rc || 0) +
      (item.nlp || 0) +
      (item.da || 0) +
      (item.dm || 0);

    setCurrentData([...currentData]);
    setFieldValue("reportDetails.items", currentData);
  };

  const getTableFields = (idx: number) => {
    const item = currentData[idx];
    if (Number(reportTypeId) === 4) {
      return (
        <>
          <TableCell sx={{ border: 1 }} align="center">
            {item.isReadOnly ? (
              ""
            ) : (
              <DebouncedTextField
                value={item.uc}
                size="small"
                disabled={item.startDependCodes !== null}
                onChange={(value: string) => changeItem(item, "uc", value)}
              />
            )}
          </TableCell>
          <TableCell sx={{ border: 1 }} align="center">
            {item.isReadOnly ? (
              ""
            ) : (
              <DebouncedTextField
                value={item.dc}
                size="small"
                disabled={item.startDependCodes !== null}
                onChange={(value: string) => changeItem(item, "dc", value)}
              />
            )}
          </TableCell>
          <TableCell sx={{ border: 1 }} align="center">
            {item.isReadOnly ? (
              ""
            ) : (
              <DebouncedTextField
                value={item.rc}
                size="small"
                disabled={item.startDependCodes !== null}
                onChange={(value: string) => changeItem(item, "rc", value)}
              />
            )}
          </TableCell>
          <TableCell sx={{ border: 1 }} align="center">
            {item.isReadOnly ? (
              ""
            ) : (
              <DebouncedTextField
                value={item.nlp}
                size="small"
                disabled={item.startDependCodes !== null}
                onChange={(value: string) => changeItem(item, "nlp", value)}
              />
            )}
          </TableCell>
          <TableCell sx={{ border: 1 }} align="center">
            {item.isReadOnly ? (
              ""
            ) : (
              <DebouncedTextField
                value={item.da}
                size="small"
                disabled={item.startDependCodes !== null}
                onChange={(value: string) => changeItem(item, "da", value)}
              />
            )}
          </TableCell>
          <TableCell sx={{ border: 1 }} align="center">
            {item.isReadOnly ? (
              ""
            ) : (
              <DebouncedTextField
                value={item.dm}
                size="small"
                disabled={item.startDependCodes !== null}
                onChange={(value: string) => changeItem(item, "dm", value)}
              />
            )}
          </TableCell>
          <TableCell sx={{ border: 1 }} align="center">
            {item.isReadOnly ? (
              ""
            ) : (
              <DebouncedTextField
                value={item.total}
                size="small"
                disabled={true}
              />
            )}
          </TableCell>
        </>
      );
    }

    return (
      <>
        <TableCell sx={{ border: 1 }} align="center">
          {item.isReadOnly ? (
            ""
          ) : (
            <DebouncedTextField
              name="userInfo.passPortInfo"
              value={item.startSum}
              size="small"
              disabled={item.startDependCodes !== null}
              onChange={(value: string) =>
                changeItemValue(
                  item.code,
                  item.dependCodes,
                  item.startDependCodes,
                  item.endDependCodes,
                  value,
                  true
                )
              }
            />
          )}
        </TableCell>
        <TableCell sx={{ border: 1 }} align="center">
          {item.isReadOnly ? (
            ""
          ) : (
            <DebouncedTextField
              name="userInfo.passPortInfo"
              value={item.endSum}
              disabled={item.endDependCodes !== null}
              size="small"
              onChange={(value: string) =>
                changeItemValue(
                  item.code,
                  item.dependCodes,
                  item.startDependCodes,
                  item.endDependCodes,
                  value,
                  false
                )
              }
            />
          )}
        </TableCell>
      </>
    );
  };

  const getTableHeads = () => {
    if (Number(reportTypeId) === 4) {
      return (
        <>
          <TableCell sx={{ border: 1 }} className="relative">
            <p className="-tw-rotate-90 tw-whitespace-nowrap tw-m-0 tw-relative tw-bottom-[-40px] tw-max-w-[60px]">
              Уставный капитал
            </p>
          </TableCell>
          <TableCell sx={{ border: 1 }} className="relative">
            <p className="-tw-rotate-90 tw-whitespace-nowrap tw-m-0 tw-relative tw-bottom-[-40px] tw-max-w-[60px]">
              Добавочный капитал
            </p>
          </TableCell>
          <TableCell sx={{ border: 1 }} className="relative">
            <p className="-tw-rotate-90 tw-whitespace-nowrap tw-m-0 tw-relative tw-bottom-[-40px] tw-max-w-[60px]">
              Резервный капитал
            </p>
          </TableCell>
          <TableCell sx={{ border: 1 }} className="relative">
            <p className="-tw-rotate-90 tw-whitespace-nowrap tw-m-0 tw-relative tw-bottom-[-40px] tw-max-w-[60px]">
              Нераспределенная
            </p>
          </TableCell>
          <TableCell sx={{ border: 1 }} className="relative">
            <p className="-tw-rotate-90 tw-whitespace-nowrap tw-m-0 tw-relative tw-bottom-[-40px] tw-max-w-[60px]">
              Доля акционеров
            </p>
          </TableCell>
          <TableCell sx={{ border: 1 }} className="relative">
            <p className="-tw-rotate-90 tw-whitespace-nowrap tw-m-0 tw-relative tw-bottom-[-40px] tw-max-w-[60px]">
              {" "}
              Доля меншества
            </p>
          </TableCell>
          <TableCell sx={{ border: 1 }} className="relative">
            <p className="-tw-rotate-90 tw-whitespace-nowrap tw-m-0 tw-relative tw-bottom-[-40px] tw-w-[80px]">
              Итого
            </p>
          </TableCell>
        </>
      );
    }

    return (
      <>
        <TableCell sx={{ border: 1 }} className="-tw-rotate-190">
          На начало отчетного периода
        </TableCell>
        <TableCell sx={{ border: 1 }} className="-tw-rotate-190">
          На конец отчетного периода
        </TableCell>
      </>
    );
  };

  return (
    <Card title="Таблица">
      <div style={{ paddingTop: 10 }} className="tw-py-4 tw-px-4 mf_block_bg">
        <form className="tw-flex tw-flex-col tw-gap-4">
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{ border: 1, width: "40%" }}
                    className="-tw-rotate-190 tw-h-48"
                  >
                    Показатели
                  </TableCell>
                  <TableCell sx={{ border: 1 }} className="-tw-rotate-190 ">
                    Код строки
                  </TableCell>
                  {getTableHeads()}
                </TableRow>
              </TableHead>
              {Boolean(currentData.length) && (
                <TableBody>
                  {currentData.map((item, idx) => (
                    <TableRow key={idx} sx={{ height: 50 }}>
                      <TableCell sx={{ border: 1 }}>{item.title}</TableCell>
                      <TableCell sx={{ border: 1 }} align="center">
                        {item.code}
                      </TableCell>
                      {getTableFields(idx)}
                    </TableRow>
                  ))}
                </TableBody>
              )}
            </Table>
          </TableContainer>
        </form>
      </div>
    </Card>
  );
};

const numRegex = /^[0-9]{0,}$/;
const DebouncedTextField: FC<any> = (prop) => {
  const { value, disabled, onChange, ...others } = prop;
  const [localValue, setLocalValue] = useState("");
  const [timeId, setTimeId] = useState<any>(null);

  useEffect(() => {
    setLocalValue(value || "");
  }, [value]);

  const debounceChange = (value: string) => {
    if (!numRegex.test(value)) return;
    setLocalValue(value);
    if (timeId) {
      clearTimeout(timeId);
    }
    setTimeId(setTimeout(() => onChange(value), 300));
  };

  return (
    <TextField
      {...others}
      value={localValue}
      disabled={disabled}
      size="small"
      onChange={(event) => debounceChange(event.target.value)}
    />
  );
};
