import React from "react";
import { useMultiwallet } from "src/connectors/multiwallet";
import { useSelector } from "react-redux";
import { $wallet } from "src/features/wallet/walletSlice";
import Modal from "../modals/Modal";
import ExitIcon from "../../../public/svgs/exitIcon.svg";
import SpinnerDots from "/public/svgs/loadingSpinner.svg";
import { UilCheckCircle } from "@iconscout/react-unicons";
import BottomSheetOptions from "../fund/BottomSheetOptions";
import { useViewport } from "../../hooks/useViewport";
import { Breakpoints } from "../../constants/Breakpoints";

interface ConnectingModalProps {
  close: () => void;
  open: boolean;
}
interface IconProps {
  active: boolean;
}
const GetIcon = ({ active }: IconProps) => {
  return (
    <>
      {!active ? (
        <div className='animate-spin mt-2'>
          <SpinnerDots />
        </div>
      ) : (
        <UilCheckCircle color={"#2CC995"} />
      )}
    </>
  );
};

function ConnectingModal({ close, open }: ConnectingModalProps) {
  const { t } = useTranslation();
  const { width } = useViewport();
  const { enabledChains } = useMultiwallet();
  const { chain } = useSelector($wallet);
  const active = enabledChains[chain]?.status === "connected";
  const connectedText = active ? "connected" : "connecting";

  return (
    <>
      {width > 0 && width >= Breakpoints.sm1 ? (
        <Modal open onClose={close}>
          <div className='md:w-[460px] w-[460px] pb-8 pl-6 pr-6 pt-5 rounded-2xl bg-black-800'>
            <div className='flex justify-end items-center w-full h-[30px]'>
              <ExitIcon className='hover:cursor-pointer' onClick={close} />
            </div>
            <div className='flex flex-col w-full h-[150px] items-center justify-center gap-5 mb-4'>
              <GetIcon active={active} />
              <div className='text-2xl font-semibold '>{connectedText}</div>
            </div>
            <div className='w-full text-center rounded-2xl px-6 py-4'>
              <div className='text-[15px] text-grey-400'>
                {
                  "By Connecting, you agree to Catalogs’ Terms of Service and acknowledge that you have read and understand the Catalog Protocol Disclaimer."
                }
              </div>
            </div>
          </div>
        </Modal>
      ) : (
        <div>
          <BottomSheetOptions title='Connecting' open={open} setOpen={close}>
            <div className='pb-2 px-2 pt-5 rounded-2xl bg-black-800'>
              <div className='flex flex-col w-full h-[150px] items-center justify-center gap-5 mb-4'>
                <GetIcon active={active} />
                <div className='text-2xl font-semibold '>{connectedText}</div>
              </div>
              <div className='w-full border-2 border-grey-600 rounded-2xl px-6 py-4'>
                <div className='text-sm text-grey-400'>{"protocolDisclaimer"}</div>
              </div>
            </div>
          </BottomSheetOptions>
        </div>
      )}
    </>
  );
}

export default ConnectingModal;
