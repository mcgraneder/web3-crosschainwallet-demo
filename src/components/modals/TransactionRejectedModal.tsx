import React, { useState } from "react";
import Modal from "src/components/modals/Modal";
import PrimaryButton from "../catalog/PrimaryButton";
import { UilExclamationTriangle, UilQuestionCircle } from "@iconscout/react-unicons";
import { useTranslation } from "react-i18next";
import { useViewport } from "../../hooks/useViewport";
import { Breakpoints } from "../../constants/Breakpoints";
import BottomSheetOptions from "../fund/BottomSheetOptions";
import { Token } from "../../types/misc";
import { LoadingIndicator } from "../icons/LoadingIndicator";
import Tooltip from "src/components/catalog/Tooltip";

interface UserRejectedModalTypes {
  onClose: () => void;
  open: boolean;
  approvalError?: boolean;
  revokeApproval?: (selectedToken: Token) => Promise<void>;
  selectedToken?: Token;
}

function RejectedModal({
  onClose,
  open,
  approvalError,
  revokeApproval,
  selectedToken,
}: UserRejectedModalTypes) {
  const { width } = useViewport();
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = () => {
    if (!revokeApproval) return;
    setLoading(true);
    revokeApproval(selectedToken as Token);
  };

  return (
    <>
      {width > 0 && width >= Breakpoints.sm1 ? (
        <Modal open onClose={() => null}>
          <div className='md:w-[475px] w-[475px] pb-8 pl-6 pr-6 pt-5 rounded-2xl bg-black-800'>
            <div className='flex flex-col w-full items-center justify-center gap-6 mt-6'>
              <div className='text-2xl font-semibold '>{t("txAndOtherStatuses.txFailed")}</div>
              <UilExclamationTriangle color='red' size={"70px"} strokeWidth={1.3} />
              <div className='text-[15px] text-center px-6 text-grey-400'>
                {approvalError
                  ? t("labelsForDeposit.revokalMsg")
                  : t("txAndOtherStatuses.txRejected")}
              </div>
            </div>
            {approvalError && (
              <div className='flex items-center justify-center gap-1 mt-4'>
                <div className='my-2 flex items-center justify-center text-grey-400'>
                  {"What is a revokal?"}
                </div>
                <div className='has-tooltip'>
                  <Tooltip
                    toolTipContainerStyle={`flex flex-col text-[13px] md:text-base items-center px-3 py-2 overflow-visible
                text-gray-400 cursor-pointer bg-black-600 rounded-xl w-[300px] md:w-[320px] tooltip top-[30px] md:top-[30px] -right-[80px]`}
                    arrowDirection={"UP"}
                    infoText={t("labelsForDeposit.revokalInformation")}
                  />
                  <UilQuestionCircle className={"text-primary"} size={"20px"} />
                </div>
              </div>
            )}
            <div className={`${approvalError ? "px-14 pb-6" : "px-20 py-6"}`}>
              <PrimaryButton
                className='justify-center w-full text-lg'
                onClick={approvalError ? onSubmit : onClose}>
                <div className='flex gap-2 items-center justify-center'>
                  {approvalError
                    ? loading
                      ? t("loadingModalCopy.processingTxn")
                      : t("labelsForDeposit.revokeApproval")
                    : t("buttons.close")}
                  {loading && approvalError && <LoadingIndicator />}
                </div>
              </PrimaryButton>
            </div>
            <div
              onClick={onClose}
              className='flex items-center text-[15px] justify-center text-grey-400 hover:text-white hover: cursor-pointer'>
              {t("buttons.back")}
            </div>
          </div>
        </Modal>
      ) : (
        <div>
          <BottomSheetOptions title='Error' open={open} setOpen={onClose}>
            <div className=' pb-8 pl-6 pr-6 pt-5 rounded-2xl bg-black-800'>
              <div className='flex flex-col w-full items-center justify-center gap-6'>
                <div className='text-xl font-semibold '>{t("txAndOtherStatuses.txFailed")}</div>
                <UilExclamationTriangle color='red' size={"70px"} strokeWidth={1.3} />
                <div className='text-[15px] text-center  text-grey-400'>
                  {approvalError
                    ? t("labelsForDeposit.revokalMsg")
                    : t("txAndOtherStatuses.txRejected")}
                </div>
              </div>
              {approvalError && (
                <div className='flex items-center justify-center gap-1 mt-4'>
                  <div className='my-2 flex items-center justify-center text-grey-400'>
                    {"What is a revokal?"}
                  </div>
                  <div className='has-tooltip'>
                    <Tooltip
                      toolTipContainerStyle={`flex flex-col text-[13px] md:text-base items-center px-3 py-2 overflow-visible
                text-gray-400 cursor-pointer bg-black-600 rounded-xl w-[300px] md:w-[320px] tooltip top-[30px] md:top-[30px] -right-[80px]`}
                      arrowDirection={"UP"}
                      infoText={t("labelsForDeposit.revokalInformation")}
                    />
                    <UilQuestionCircle className={"text-primary"} size={"20px"} />
                  </div>
                </div>
              )}
              <div className={`${approvalError ? "px-2 pb-6" : "px-20 py-6"}`}>
                <PrimaryButton
                  className='justify-center w-full text-base'
                  onClick={approvalError ? onSubmit : onClose}>
                  <div className='flex gap-2 items-center justify-center'>
                    {approvalError
                      ? loading
                        ? t("loadingModalCopy.processingTxn")
                        : t("labelsForDeposit.revokeApproval")
                      : t("buttons.close")}
                    {loading && approvalError && <LoadingIndicator />}
                  </div>
                </PrimaryButton>
              </div>
              <div
                onClick={onClose}
                className='flex items-center text-[15px] justify-center text-grey-400 hover:text-white hover: cursor-pointer'>
                {"back"}
              </div>
            </div>
          </BottomSheetOptions>
        </div>
      )}
    </>
  );
}

export default RejectedModal;
