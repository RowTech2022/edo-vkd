import { Dialog } from "@mui/material";
import { ValueId } from "@services/api";
import { Card } from "@ui";
import { useFormik } from "formik";
import { useMemo, useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  GrbsList,
  GrbsListItem,
  GrbsListSetRequest,
  GrbsSeqnumsResponse,
  useGetMFAccessGrbsListMutation,
  useGetMFAccessGrbsSeqnumsMutation,
  useSaveMFAccessFormMutation,
  useSignMFAccessFormMutation,
  useUpdateMFAccessFormMutation,
  useUpdateMFAccessGrbsSeqnumsBzMutation,
  useUpdateMFAccessGrbsSeqnumsDzMutation,
  useUpdateMFAccessGrbsSetMutation,
} from "@services/accessMfApi";
import { useLazyFetchMfAccessDefaultPageQuery } from "@services/generalApi";
import { useLazyFetchGetCuratorHeadQuery } from "@services/tfmisApi";
import { GrbsForm } from "./GrbsForm";
import { GrbsAccessListForm } from "./GrbsAccessListForm";
import {
  initialValues,
  InitialValuesType,
  validationSchema,
} from "./helpers/schema";
import { useAnimatedPen } from "@hooks";
import { RejectModal } from "./modals/RejectModal";
import { UserVisas } from "./components/UserVisas";
import { DocHistories } from "./components/DocHistories";
import { MfAccessFormStates, SignType } from "./helpers/constants";
import { UserInfo } from "./components/UserInfo";
import { UserAccess } from "./components/UserAccess";
import { DepartmentHead } from "./components/DepartmentHead";
import { AccessParams } from "./components/AccessParams";
import { Application } from "./components/Application";
import { useNavigate, useParams } from "react-router";

type Props = {
  new?: boolean;
  entry?: MF.AccessForm;
};

const MFAccessForm = (props: Props) => {
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id || 0;

  const [currentGrbs, setCurrentGrbs] = useState<GrbsListItem[]>(
    (props?.entry?.currentGrbs?.items! as any) || []
  );

  const [defaultPage, { isFetching: isFetchingDefPage }] =
    useLazyFetchMfAccessDefaultPageQuery();
  const [getHead, { data: heads, isFetching: isFetchHead }] =
    useLazyFetchGetCuratorHeadQuery();

  const [selectedGrbs, setSelectedGrbs] = useState<GrbsListItem | null>(null);
  const [selectedPbs, setSelectedPbs] = useState<GrbsListItem | null>(null);
  const [fetchGrbsList] = useGetMFAccessGrbsListMutation();
  const [setGrbsMFAccess] = useUpdateMFAccessGrbsSetMutation();
  const [fetchSeqnumsList] = useGetMFAccessGrbsSeqnumsMutation();
  const [setSeqnumsBz] = useUpdateMFAccessGrbsSeqnumsBzMutation();
  const [setSeqnumsDz] = useUpdateMFAccessGrbsSeqnumsDzMutation();

  const [saveAccessForm] = useSaveMFAccessFormMutation();
  const [updateAccessForm] = useUpdateMFAccessFormMutation();
  const [signAccessForm] = useSignMFAccessFormMutation();

  const [rejectModalOpen, setRejectModalOpen] = useState<boolean>(false);

  const [mDocType, setmDocType] = useState<number>();
  const [mTreasure, setmTreasure] = useState<ValueId>() || [];

  const [mBz, setmBz] = useState<ValueId[]>();
  const [mDz, setmDz] = useState<ValueId[]>();

  const [grbsPopupOpen, setGrbsPopupOpen] = useState(false);

  const [pbsPopupOpen, setPbsPopupOpen] = useState(false);
  const [grbsAccessPopup, setGrbsAccessPopup] = useState(false);
  const [selectedGrbsList, setSelectedGrbsList] = useState<
    Record<string, boolean>
  >({});
  const [selectedPbsList, setSelectedPbsList] = useState<
    Record<string, boolean>
  >({});

  const [selectedSeqnumsBzList, setSelectedSeqnumsBzList] = useState<
    Record<string, boolean>
  >({});
  const [selectedSeqnumsDzList, setSelectedSeqnumsDzList] = useState<
    Record<string, boolean>
  >({});

  const [grbsSelectAll, setGrbsSelectAll] = useState(false);
  const [pbsSelectAll, setPbsSelectAll] = useState(false);
  const [bzSelectAll, setBzSelectAll] = useState(false);
  const [dzSelectAll, setDzSelectAll] = useState(false);

  const [grbsList, setGrbsList] = useState<GrbsList | null>(null);
  const [pbsList, setPbsList] = useState<GrbsList | null>(null);
  const [seqnumsGrbs, setSeqnumsGrbs] = useState<GrbsSeqnumsResponse | null>(
    null
  );

  const formik = useFormik<InitialValuesType>({
    initialValues: props.new
      ? initialValues
      : ({
          userInfo: props.entry?.userInfo,
          access: props.entry?.access,
        } as InitialValuesType),
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(values);
      handleSubmit({
        ...values,
        access: {
          pbsCode: values.access?.pbsCode || [],
          budgetVariant: values.access?.budgetVariant || [],
          programs: values.access?.programs || [],
          seqnums: values.access?.seqnums || [],
          dzSeqnums: values.access?.dzSeqnums || [],
          pages: accessPage,
        },
      });
    },
  });

  const saveGrbsListAccess = (
    isPbs?: boolean,
    remove?: boolean,
    typeReq: number = 0
  ) => {
    const toastId = toast.loading(
      `Идет ${remove ? "удаление" : "сохранение"} доступов`
    );
    const list = isPbs ? pbsList : grbsList;
    const selected = isPbs ? selectedPbsList : selectedGrbsList;
    const grbs = Object.keys(selected)
      .filter((grbsId) => selected[grbsId])
      .map((grbsId) => ({
        ...(list?.items.find((value) => value.id === grbsId) as GrbsListItem),
        value: undefined,
        include: !remove || true,
      }));

    const payload: GrbsListSetRequest = {
      id: Number(id),
      remove: remove || false,
      grbs: grbs || [],
      typeReq,
    };

    setGrbsMFAccess(payload)
      .then(() => {
        toast.dismiss(toastId);
        toast.success(`Доступы успешно ${remove ? "удалени" : "сохранени"}`);
        handleFetchGrbsList();
      })
      .catch((err) => {
        toast.success(
          `Ошибка при ${remove ? "удаление" : "сохранение"} доступов`
        );
        toast.dismiss(toastId);
      });
  };

  const removeGrbsListAccess = (isPbs?: boolean) =>
    saveGrbsListAccess(isPbs, true);

  const handleGrbsClick = (items: GrbsListItem[], checkAll?: boolean) => {
    const checkAllStatus = !grbsSelectAll;
    items.forEach((item) => {
      selectedGrbsList[item.id] = checkAll
        ? checkAllStatus
        : !selectedGrbsList[item.id];
    });
    setGrbsSelectAll(checkAllStatus);
    setSelectedGrbsList({ ...selectedGrbsList });
  };

  const handlePbsClick = (items: GrbsListItem[], checkAll?: boolean) => {
    const checkAllStatus = !pbsSelectAll;
    items.forEach((item) => {
      selectedPbsList[item.id] = checkAll
        ? checkAllStatus
        : !selectedPbsList[item.id];
    });
    setPbsSelectAll(checkAllStatus);
    setSelectedPbsList(selectedPbsList);
  };

  const handleDoubleClickGrbsList = (item: GrbsListItem) => {
    fetchGrbsList({
      id: Number(id),
      prefix: item.id,
    })
      .then((res: any) => {
        if (!res.error) {
          let asd: Record<string, boolean> = {};
          res.data?.items &&
            res.data?.items.forEach((item: any) => {
              if (item.include) {
                asd[item.id] = true;
              }
            });
          setSelectedPbsList(asd);
          setPbsList(res.data);
          setSelectedGrbs(item);
          setPbsPopupOpen(true);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleDoubleClickPbsList = (item: GrbsListItem) => {
    fetchSeqnumsList({
      id: Number(id),
      pbs: item.id,
    })
      .then((res: any) => {
        if (!res.error) {
          setSeqnumsGrbs(res.data);

          res.data?.bz &&
            res.data?.bz.forEach((item: any) => {
              if (item.include) {
                selectedSeqnumsBzList[item.id] = true;
              }
            });
          setSelectedSeqnumsBzList(selectedSeqnumsBzList);

          res.data?.dz &&
            res.data?.dz.forEach((item: any) => {
              if (item.include) {
                selectedSeqnumsDzList[item.id] = true;
              }
            });
          setSelectedSeqnumsDzList(selectedSeqnumsDzList);

          setSelectedPbs(item);
          setGrbsAccessPopup(true);
        }
      })
      .catch((err) => console.log("Fetch grbs seqnums: ", err));
  };

  const handleSelectSeqnum = (
    list: GrbsListItem[],
    isDz?: boolean,
    checkAll?: boolean
  ) => {
    const checkAllStatus = isDz ? !dzSelectAll : !bzSelectAll;
    const selectList = isDz ? selectedSeqnumsDzList : selectedSeqnumsBzList;
    list.forEach((item) => {
      selectList[item.id] = checkAll ? checkAllStatus : !selectList[item.id];
    });
    if (isDz) {
      setSelectedSeqnumsDzList(selectList);
      setDzSelectAll(checkAllStatus);
    } else {
      setSelectedSeqnumsBzList(selectList);
      setBzSelectAll(checkAllStatus);
    }
  };

  const handleSaveSeqnum = (isDz?: boolean, remove?: boolean) => {
    const selectList = isDz ? selectedSeqnumsDzList : selectedSeqnumsBzList;

    const toastId = toast.loading(
      `Идет ${remove ? "удаление" : "сохранение"} доступов`
    );
    const bz = Object.keys(selectList)
      .filter((grbsId) => selectList[grbsId])
      .map((id) => ({
        id,
      }));

    const payload: any = {
      id: Number(id),
      pbs: "",
      remove: remove || false,
    };

    payload.pbs = selectedPbs?.id;
    if (isDz) {
      payload.dz = bz;
      setSeqnumsDz(payload)
        .then((res) => {
          toast.dismiss(toastId);
          toast.success(`Доступы успешно ${remove ? "удалени" : "сохранени"}`);
          handleFetchGrbsList();
        })
        .catch((err) => {
          toast.dismiss(toastId);
          toast.error(
            `Ошибка при ${remove ? "удалении" : "сохранении"} доступов`
          );
        });
    } else {
      payload.bz = bz;
      setSeqnumsBz(payload)
        .then((res) => {
          toast.dismiss(toastId);
          toast.success(`Доступы успешно ${remove ? "удалени" : "сохранени"}`);
          handleFetchGrbsList();
        })
        .catch((err) => {
          toast.dismiss(toastId);
          toast.error(
            `Ошибка при ${remove ? "удалении" : "сохранении"} доступов`
          );
        });
    }
  };

  const loadHead = () => {
    let treasure = mTreasure?.id || 100;

    let dt = {
      type: mDocType || 0,
      seqnums: mBz || [],
      dzSeqnums: mDz || [],
      treasureCode: parseInt(treasure?.toString()),
    };

    getHead(dt);
  };

  const handleFetchGrbsList = () => {
    fetchGrbsList({
      id: Number(id),
      prefix: "",
    })
      .then((res: any) => {
        if (!res.error) {
          res.data?.items.forEach((item: any) => {
            if (item.include) {
              selectedGrbsList[item.id] = true;
            }
          });
          setSelectedGrbsList({ ...selectedGrbsList });
          const selected = Object.entries(selectedGrbsList)
            .filter((item) => item[1])
            .map((item) => item[0]);
          setCurrentGrbs(
            res.data?.items.filter((item: any) => selected.includes(item.id))
          );
          setGrbsList(res.data);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (mDocType && mTreasure) {
      loadHead();
    }
  }, [mDocType, mTreasure]);

  useEffect(() => {
    handleFetchGrbsList();
  }, [params.id]);

  const [accessPageResponse, setAccessPageResponse] = useState<
    MF.PageAccessInfo[]
  >([]);
  const [accessPage, setAccessPage] = useState<MF.PageAccessInfo[]>([]);

  const handleGetDefaultPage = () => {
    defaultPage().then((data: any) => {
      const pages = data.data as MF.PageAccessInfo[];
      setAccessPageResponse(pages);

      if (!props.new) {
        setAccessPage(props?.entry?.access.pages || []);
      } else {
        setAccessPage(
          pages?.filter((x) => x.type === formik.values.userInfo?.docType)
        );
      }
    });
  };

  useEffect(() => {
    handleGetDefaultPage();
  }, []);

  const [isBudget, setIsBudget] = useState<boolean>(
    (props?.entry?.userInfo?.docType || 1) === 1
  );

  const [podBudget, setPodBudget] = useState<boolean>(
    (props?.entry?.userInfo?.docType || 2) === 2
  );
  const [isSupersivor, setIsSupersivor] = useState<boolean>(
    (props?.entry?.userInfo?.docType || 3) === 3
  );

  const canSave = useMemo<boolean>(() => {
    if (props.new) {
      return true;
    }
    if (props.entry && props.entry.state === MfAccessFormStates.Registration) {
      return true;
    }
    return false;
  }, [props]);

  const handleSave = async ({ userInfo, access }: InitialValuesType) => {
    toast.promise(
      async () => {
        const res = await saveAccessForm({
          userInfo,
          access,
        });
        if ("data" in res) {
          navigate(`/modules/documents/mf-access-forms/show/${res.data.id}`);
        }
      },
      {
        pending: "Форма сохраняется",
        success: "Форма сохранена",
        error: "Произошла ошибка",
      }
    );
  };

  const handleUpdate = async ({ userInfo, access }: InitialValuesType) => {
    if (props.entry) {
      toast.promise(
        updateAccessForm({
          id: props.entry.id,
          userInfo,
          access,
          timestamp: props.entry.timestamp,
        }),
        {
          pending: "Форма обновляется",
          success: "Форма обновлена",
          error: "Произошла ошибка",
        }
      );
    }
  };

  const handleSignSignatureBody = async (type: SignType) => {
    try {
      if (props.entry) {
        toast.promise(
          signAccessForm({
            id: props.entry.id,
            type: type,
            timestamp: props.entry.timestamp,
          }).then((c: any) => {
            if (c.error?.data?.StatusCode !== undefined) {
              toast.error(
                "Ошибка при подписание документа: \n" +
                  JSON.stringify(c.error?.data?.Message)
              );
            } else toast.success("Карта утверждена");
          }),
          {
            pending: "Форма утверждается",
          }
        );
      }
    } catch (error) {
      toast.error(JSON.stringify(error));
    }
  };

  const changeItemValue = (docId: number, tip: number, check: boolean) => {
    let updatedList = accessPage?.map((el) =>
      el.id === docId
        ? {
            ...el,
            a1: tip === 1 ? check : el.a1,
            a2: tip === 2 ? check : el.a2,
            a3: tip === 3 ? check : el.a3,
            a4: tip === 4 ? check : el.a4,
            a5: tip === 5 ? check : el.a5,
            a6: tip === 6 ? check : el.a6,
          }
        : el
    );

    setAccessPage(updatedList);
  };

  const handleSubmit = async (values: InitialValuesType) => {
    if (props.new) {
      handleSave(values);
    } else if (props.entry) {
      handleUpdate(values);
    }
  };

  const { iconContent, handlePenClick, ...penHandlers } = useAnimatedPen();

  return (
    <>
      <form className="tw-mb-4 tw-relative" onSubmit={formik.handleSubmit}>
        {iconContent}
        <div className="tw-flex tw-flex-col tw-gap-4">
          <Application
            formik={formik}
            entry={props.entry}
            create={props.new}
            canSave={canSave}
            penHandlers={penHandlers}
            handlePenClick={handlePenClick}
            handleSignSignatureBody={handleSignSignatureBody}
            setRejectModalOpen={setRejectModalOpen}
          />
          <div className="tw-mb-4">
            <Card title="Дархости мазкур бо фармоиши ВМ №48 аз 18.05.2023 тасдик шудааст" />
          </div>

          <AccessParams
            formik={formik}
            currentGrbs={currentGrbs}
            canSave={canSave}
            setGrbsPopupOpen={setGrbsPopupOpen}
          />

          <UserInfo
            formik={formik}
            canSave={canSave}
            accessPageResponse={accessPageResponse}
            setIsBudget={setIsBudget}
            setPodBudget={setPodBudget}
            setIsSupersivor={setIsSupersivor}
            setAccessPage={setAccessPage}
            setmDocType={setmDocType}
            setmTreasure={setmTreasure}
          />

          <UserAccess
            formik={formik}
            isBudget={isBudget}
            podBudget={podBudget}
            isSupersivor={isSupersivor}
            accessPage={accessPage}
            changeItemValue={changeItemValue}
          />

          <DepartmentHead
            formik={formik}
            canSave={canSave}
            penHandlers={penHandlers}
            signBtnDisabled={
              props.new ||
              props.entry?.transitions.buttonSettings.btn_sign_headDepart
                .readOnly
            }
            heads={heads}
            handleSignSignatureBody={handleSignSignatureBody}
            handlePenClick={handlePenClick}
          />

          <UserVisas visas={props.entry?.userVisas} />

          <DocHistories histories={props.entry?.documentHistories} />
        </div>
      </form>
      <div id="modals">
        <RejectModal
          entry={props.entry}
          open={rejectModalOpen}
          onClose={() => setRejectModalOpen(false)}
        />
        <Dialog
          maxWidth="lg"
          onBackdropClick={() => setGrbsPopupOpen(false)}
          open={grbsPopupOpen && Boolean(grbsList)}
        >
          <GrbsForm
            title="Список ГРБС"
            list={grbsList?.items || []}
            selectedList={selectedGrbsList}
            onClick={handleGrbsClick}
            onDoubleClick={handleDoubleClickGrbsList}
            onClose={() => setGrbsPopupOpen(false)}
            saveGrbsAccess={saveGrbsListAccess}
            removeGrbsAccess={removeGrbsListAccess}
          />
        </Dialog>
        <Dialog
          maxWidth="lg"
          onBackdropClick={() => setPbsPopupOpen(false)}
          open={pbsPopupOpen && Boolean(pbsList)}
        >
          <GrbsForm
            title={`Список ПБС ${selectedGrbs?.id} - ${selectedGrbs?.value}`}
            list={pbsList?.items || []}
            selectedList={selectedPbsList}
            onClick={handlePbsClick}
            onDoubleClick={handleDoubleClickPbsList}
            onClose={() => setPbsPopupOpen(false)}
            saveGrbsAccess={saveGrbsListAccess}
            removeGrbsAccess={removeGrbsListAccess}
            isPbs={true}
          />
        </Dialog>
        <Dialog
          maxWidth="lg"
          onBackdropClick={() => setGrbsAccessPopup(false)}
          open={grbsAccessPopup && Boolean(seqnumsGrbs)}
        >
          <GrbsAccessListForm
            titlePostfix={`${selectedPbs?.id} - ${selectedPbs?.value}`}
            onClose={() => setGrbsAccessPopup(false)}
            bzList={seqnumsGrbs?.bz || []}
            dzList={seqnumsGrbs?.dz || []}
            selectedBz={selectedSeqnumsBzList}
            selectedDz={selectedSeqnumsDzList}
            setSelected={handleSelectSeqnum}
            saveSeqnum={handleSaveSeqnum}
          />
        </Dialog>
      </div>
    </>
  );
};

export default MFAccessForm;
