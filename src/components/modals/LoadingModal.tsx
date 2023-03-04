import Modal from "src/components/modals/Modal";
import SpinnerDots from "/public/svgs/spinner-dots.svg";
import Card from "../catalog/Card";
import { useTranslation } from "next-i18next";
import PrimaryButton from "src/components/catalog/PrimaryButton";
import Gears from "/public/svgs/gears.svg";
import { useRouter } from "next/router";
import { useFundState } from "src/contexts/useFundState";
import CheckCircle from "../../../public/svgs/checkCircle.svg";
import ProgressBar from "../ProgressHelpers/ProgressBar/index";
import { useViewport } from "../../hooks/useViewport";
import { Breakpoints } from "../../constants/Breakpoints";
import BottomSheetOptions from "../fund/BottomSheetOptions";
import RejectedModal from "./TransactionRejectedModal";
import { Dispatch, SetStateAction } from "react";
import { Token } from "../../types/misc";

interface TxnProcessLoaderProps {
  open: boolean;
  onClose?: () => void;
  label: string;
  subLabel?: string;
  rejected: boolean;
  setRejected: Dispatch<SetStateAction<boolean>>;
  approvalError?: boolean;
  revokeApproval?: (selectedToken: Token) => Promise<void>;
  selectedToken?: Token;
}

interface SimpleModalProps {
  currentStep: number;
  label: string;
  subLabel?: string;
  open: boolean;
}

interface StatusModalProps {
  open: boolean;
  currentStep: number;
  submitted: boolean;
  txSigned: boolean;
  onClose: (() => void) | undefined;
}

interface StatusModalInnerProps {
  submitted: boolean;
  txSigned: boolean;
  onClose: (() => void) | undefined;
}

const SimpleModal = ({ currentStep, label, subLabel, open }: SimpleModalProps) => {
  const { width } = useViewport();
  const { t } = useTranslation();

  return (
    <>
      {width > 0 && width >= Breakpoints.sm1 ? (
        <Modal open={open} onClose={() => null}>
          <div className='md:w-[400px] w-[350px] mx-auto p-4 h-[284px] rounded-2xl bg-black-800 flex items-center justify-center flex-col '>
            <h1 className='text-2xl font-semibold tracking-wide text-center md:text-2xl '>
              {label}
            </h1>
            <p className='mt-2 mb-8 text-sm text-center md:text-normal'>{subLabel}</p>
            {currentStep == 3 ? (
              <div className='mt-2'>
                <CheckCircle color={"#2CC995"} />
              </div>
            ) : (
              <div className='mt-2 animate-spin'>
                <SpinnerDots />
              </div>
            )}
          </div>
        </Modal>
      ) : (
        <div>
          <BottomSheetOptions
            hideCloseIcon
            title={t("loadingModalCopy.processingTxn")}
            open={open}
            setOpen={() => null}>
            <div className='md:w-[400px] w-[350px] mx-auto p-4 h-[284px] rounded-2xl bg-black-800 flex items-center justify-center flex-col '>
              <h1 className='text-2xl font-semibold tracking-wide text-center md:text-2xl '>
                {label}
              </h1>
              <p className='mt-2 mb-8 text-sm text-center md:text-normal'>{subLabel}</p>
              {currentStep == 3 ? (
                <div className='mt-2'>
                  <CheckCircle color={"#2CC995"} />
                </div>
              ) : (
                <div className='mt-2 animate-spin'>
                  <SpinnerDots />
                </div>
              )}
            </div>
          </BottomSheetOptions>
        </div>
      )}
    </>
  );
};

const StatusModalInner = ({ submitted, txSigned, onClose }: StatusModalInnerProps) => {
  const { t } = useTranslation();
  const { width } = useViewport();
  const router = useRouter();

  const onClick = () => {
    router.push("/transactions");
  };
  const mobileWidth = width > 0 && width <= Breakpoints.sm;

  return (
    <>
      {!submitted ? (
        <>
          <div className='mt-2 animate-spin'>
            <SpinnerDots />
          </div>
          <div className='flex flex-col gap-3 tracking-wide text-center'>
            <h1
              className={`md:text-2xl text-lg font-bold capitalize  ${
                mobileWidth && "whitespace-nowrap"
              }`}>
              {txSigned
                ? t("loadingModalCopy.txIsBeingProcessed")
                : t("loadingModalCopy.txConfirm")}
            </h1>
            <p
              className={`font-normal md:text-lg text-sm text-grey-400 ${
                mobileWidth && "text-sm"
              }`}>
              {t("loadingModalCopy.pleaseDoNotClose")}
            </p>
          </div>
        </>
      ) : (
        <>
          <div className='mt-2'>
            <Gears />
          </div>
          <div className='flex flex-col items-center gap-3 tracking-wide text-center'>
            <h1 className='text-lg font-bold capitalize md:text-2xl'>
              {t("loadingModalCopy.txHasBeenSubmitted")}
            </h1>
            <p
              className={`max-w-[340px] md:text-lg text-sm ml-3 mr-3 text-grey-400 ${
                mobileWidth && "text-sm"
              }`}>
              {t("actionDescriptors.txIsBeingProcessedDesc")}
            </p>
          </div>
          <div className='flex flex-col gap-4'>
            <PrimaryButton
              onClick={onClick}
              className={`md:text-lg sm:text-sm ${mobileWidth && "text-sm"}`}>
              {" "}
              {t("buttons.viewTxLog")}{" "}
            </PrimaryButton>
            <div
              className='flex items-center justify-center font-semibold text-gray-500 md:text-lg text-normal hover:cursor-pointer'
              onClick={onClose}>
              Close
            </div>
          </div>
        </>
      )}
    </>
  );
};

const StatusModal = ({ open, currentStep, submitted, txSigned, onClose }: StatusModalProps) => {
  const { width } = useViewport();
  const { t } = useTranslation();

  const mobileWidth = width > 0 && width <= Breakpoints.sm;

  return (
    <>
      {width > 0 && width >= Breakpoints.sm1 ? (
        <Modal open={open} onClose={() => null}>
          <Card
            dialog
            className={`bg-black-800 md:pt-7 md:pl-6 md:pr-6 md:pb-14 sm:px-10 sm:pb-12 ${
              mobileWidth && "pb-12 px-10"
            }`}>
            <ProgressBar currentStep={currentStep} />
            <div className='flex flex-col items-center justify-center gap-8 mx-5 mt-10 rounded-2xl bg-black-800 md:mx-1'>
              <StatusModalInner submitted={submitted} txSigned={txSigned} onClose={onClose} />
            </div>
          </Card>
        </Modal>
      ) : (
        <div>
          <BottomSheetOptions
            hideCloseIcon
            title={t("loadingModalCopy.processingTxn")}
            open={open}
            setOpen={() => null}>
            <div className='p-2'>
              <ProgressBar currentStep={currentStep} />
              <div className='flex flex-col items-center justify-center gap-8 mx-5 mt-10 rounded-2xl bg-black-800 md:mx-1'>
                <StatusModalInner submitted={submitted} txSigned={txSigned} onClose={onClose} />
              </div>
            </div>
          </BottomSheetOptions>
        </div>
      )}
    </>
  );
};
const LoadingModal = ({
  open,
  label,
  subLabel,
  onClose,
  rejected,
  setRejected,
  approvalError,
  revokeApproval,
  selectedToken,
}: TxnProcessLoaderProps) => {
  const { submitted, confirmingTx, currentStep, txSigned } = useFundState();
  return (
    <>
      {!rejected ? (
        !confirmingTx ? (
          <SimpleModal currentStep={currentStep} label={label} subLabel={subLabel} open={open} />
        ) : (
          <>
            <StatusModal
              open
              currentStep={currentStep}
              submitted={submitted}
              txSigned={txSigned}
              onClose={onClose}
            />
          </>
        )
      ) : (
        <RejectedModal
          onClose={() => {
            setRejected(false);
            onClose?.();
          }}
          open={rejected}
          approvalError={approvalError}
          revokeApproval={revokeApproval}
          selectedToken={selectedToken}
        />
      )}
    </>
  );
};

export default LoadingModal;
