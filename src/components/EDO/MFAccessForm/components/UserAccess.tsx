import { FC } from "react";
import {
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Card } from "@ui";
import { FormikProps } from "formik";
import { InitialValuesType } from "../helpers/schema";

interface IUserAccess {
  formik: FormikProps<InitialValuesType>;
  isBudget?: boolean;
  podBudget?: boolean;
  isSupersivor?: boolean;
  accessPage: MF.PageAccessInfo[];
  changeItemValue: (docId: number, tip: number, check: boolean) => void;
}

export const UserAccess: FC<IUserAccess> = ({
  formik,
  isBudget,
  podBudget,
  isSupersivor,
  accessPage,
  changeItemValue,
}) => {
  return (
    <Card title="Доступы">
      <div className="tw-py-4 tw-px-4 mf_block_bg">
        <TableContainer>
          <Table size="small" sx={{ borderRadius: "16px" }}>
            {isBudget ? (
              <TableHead>
                <TableRow>
                  <TableCell sx={{ border: 1, width: "50%" }} rowSpan={2}>
                    Наименования
                  </TableCell>
                  <TableCell sx={{ border: 1 }} align="center" colSpan={9}>
                    Доступы и права
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    sx={{ border: 1 }}
                    className="-tw-rotate-190 tw-h-48"
                  >
                    Знак
                  </TableCell>
                  <TableCell sx={{ border: 1 }} className="-tw-rotate-190 ">
                    Просмотр
                  </TableCell>
                  <TableCell sx={{ border: 1 }} className="-tw-rotate-190">
                    Редактировать Готов к утверждению
                  </TableCell>
                  <TableCell sx={{ border: 1 }} className="-tw-rotate-190">
                    Утвердить
                  </TableCell>
                  <TableCell sx={{ border: 1 }} className="-tw-rotate-190">
                    Одобрить Принять
                  </TableCell>
                  <TableCell sx={{ border: 1 }} className="-tw-rotate-190">
                    Согласовать
                  </TableCell>
                  <TableCell sx={{ border: 1 }} className="-tw-rotate-190">
                    Разрешить финансирование
                  </TableCell>
                </TableRow>
              </TableHead>
            ) : (
              <TableHead>
                <TableRow>
                  <TableCell sx={{ border: 1, width: "50%" }} rowSpan={2}>
                    Наименования
                  </TableCell>
                  <TableCell sx={{ border: 1 }} align="center" colSpan={9}>
                    Доступы и права
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    sx={{ border: 1 }}
                    className="-tw-rotate-190 tw-h-48"
                  >
                    Знак
                  </TableCell>
                  <TableCell sx={{ border: 1 }} className="-tw-rotate-190 ">
                    Просмотр
                  </TableCell>
                  <TableCell sx={{ border: 1 }} className="-tw-rotate-190">
                    Готов к утверждению
                  </TableCell>
                  <TableCell sx={{ border: 1 }} className="-tw-rotate-190">
                    Утвердить
                  </TableCell>
                  <TableCell sx={{ border: 1 }} className="-tw-rotate-190">
                    Принять к исполнению
                  </TableCell>
                  <TableCell sx={{ border: 1 }} className="-tw-rotate-190">
                    Проверено
                  </TableCell>
                  <TableCell sx={{ border: 1 }} className="-tw-rotate-190">
                    Оплатить
                  </TableCell>
                </TableRow>
              </TableHead>
            )}
            <TableBody>
              {isBudget ? (
                <TableRow key="omoda">
                  <TableCell
                    className="tw-bg-secondary/40"
                    sx={{ border: 1 }}
                    colSpan={10}
                  >
                    Подготовка
                  </TableCell>
                </TableRow>
              ) : (
                ""
              )}
              {isBudget &&
                accessPage?.filter(
                  (x) => x.type === formik.values.userInfo?.docType
                ) &&
                accessPage
                  .filter((x) => x.type === formik.values.userInfo?.docType)
                  .map((item) => (
                    <TableRow key={item.id}>
                      <TableCell sx={{ border: 1 }}>{item.name}</TableCell>
                      <TableCell sx={{ border: 1 }} align="center">
                        {item.code}
                      </TableCell>
                      <TableCell sx={{ border: 1 }} align="center">
                        <Checkbox
                          checked={item.a1}
                          onChange={(event) => {
                            changeItemValue(item.id, 1, event.target.checked);
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ border: 1 }} align="center">
                        <Checkbox
                          checked={item.a2}
                          onChange={(event) => {
                            changeItemValue(item.id, 2, event.target.checked);
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ border: 1 }} align="center">
                        <Checkbox
                          checked={item.a3}
                          onChange={(event) => {
                            changeItemValue(item.id, 3, event.target.checked);
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ border: 1 }} align="center">
                        <Checkbox
                          checked={item.a4}
                          onChange={(event) => {
                            changeItemValue(item.id, 4, event.target.checked);
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ border: 1 }} align="center">
                        <Checkbox
                          checked={item.a5}
                          onChange={(event) => {
                            changeItemValue(item.id, 5, event.target.checked);
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ border: 1 }} align="center">
                        <Checkbox
                          checked={item.a6}
                          onChange={(event) => {
                            changeItemValue(item.id, 6, event.target.checked);
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}

              {podBudget ? (
                <TableRow key="omodaDarmad">
                  <TableCell
                    className="tw-bg-secondary/40"
                    sx={{ border: 1 }}
                    colSpan={10}
                  >
                    Испольнение
                  </TableCell>
                </TableRow>
              ) : (
                ""
              )}
              {podBudget &&
                accessPage?.filter(
                  (x) => x.type === formik.values.userInfo?.docType
                ) &&
                accessPage
                  .filter((x) => x.type === formik.values.userInfo?.docType)
                  .map((item) => (
                    <TableRow key={item.id}>
                      <TableCell sx={{ border: 1 }}>{item.name}</TableCell>
                      <TableCell sx={{ border: 1 }} align="center">
                        {item.code}
                      </TableCell>
                      <TableCell sx={{ border: 1 }} align="center">
                        <Checkbox
                          checked={item.a1}
                          onChange={(event) => {
                            changeItemValue(item.id, 1, event.target.checked);
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ border: 1 }} align="center">
                        <Checkbox
                          checked={item.a2}
                          onChange={(event) => {
                            changeItemValue(item.id, 2, event.target.checked);
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ border: 1 }} align="center">
                        <Checkbox
                          checked={item.a3}
                          onChange={(event) => {
                            changeItemValue(item.id, 3, event.target.checked);
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ border: 1 }} align="center">
                        <Checkbox
                          checked={item.a4}
                          onChange={(event) => {
                            changeItemValue(item.id, 4, event.target.checked);
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ border: 1 }} align="center">
                        <Checkbox
                          checked={item.a5}
                          onChange={(event) => {
                            changeItemValue(item.id, 5, event.target.checked);
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ border: 1 }} align="center">
                        <Checkbox
                          checked={item.a6}
                          onChange={(event) => {
                            changeItemValue(item.id, 6, event.target.checked);
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
              {isSupersivor ? (
                <TableRow key="rohbar">
                  <TableCell
                    className="tw-bg-secondary/40"
                    sx={{ border: 1 }}
                    colSpan={10}
                  >
                    Руководитель
                  </TableCell>
                </TableRow>
              ) : (
                ""
              )}
              {isSupersivor &&
                accessPage?.filter(
                  (x) => x.type === formik.values.userInfo?.docType
                ) &&
                accessPage
                  .filter((x) => x.type === formik.values.userInfo?.docType)
                  .map((item) => (
                    <TableRow key={item.id}>
                      <TableCell sx={{ border: 1 }}>{item.name}</TableCell>
                      <TableCell sx={{ border: 1 }} align="center">
                        {item.code}
                      </TableCell>
                      <TableCell sx={{ border: 1 }} align="center">
                        <Checkbox
                          checked={item.a1}
                          onChange={(event) => {
                            changeItemValue(item.id, 1, event.target.checked);
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ border: 1 }} align="center">
                        <Checkbox
                          checked={item.a2}
                          onChange={(event) => {
                            changeItemValue(item.id, 2, event.target.checked);
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ border: 1 }} align="center">
                        <Checkbox
                          checked={item.a3}
                          onChange={(event) => {
                            changeItemValue(item.id, 3, event.target.checked);
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ border: 1 }} align="center">
                        <Checkbox
                          checked={item.a4}
                          onChange={(event) => {
                            changeItemValue(item.id, 4, event.target.checked);
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ border: 1 }} align="center">
                        <Checkbox
                          checked={item.a5}
                          onChange={(event) => {
                            changeItemValue(item.id, 5, event.target.checked);
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ border: 1 }} align="center">
                        <Checkbox
                          checked={item.a6}
                          onChange={(event) => {
                            changeItemValue(item.id, 6, event.target.checked);
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </Card>
  );
};
