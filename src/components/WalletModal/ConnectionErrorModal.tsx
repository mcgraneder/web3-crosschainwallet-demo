import React from "react";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";

import Modal from "../modals/Modal";
import ExitIcon from "../../../public/svgs/exitIcon.svg";
import PrimaryButton from "src/components/catalog/PrimaryButton";
import { useTranslation } from "react-i18next";
import AlertTriangle from "../../../public/svgs/alertTriangle.svg";
import { useViewport } from "../../hooks/useViewport";
import { Breakpoints } from "../../constants/Breakpoints";
import BottomSheetOptions from "../fund/BottomSheetOptions";
import { Toast } from "@/utils/toast";
import UnsupportedNetworkModal from "./UnsupportedNetworkModal";

interface ConnectionErrorModalProps {
  close: () => void;
}
function ConnectionErrorModal({ close }: ConnectionErrorModalProps) {
  const { width } = useViewport();
  const { t } = useTranslation();

  return (
    <>
      {width > 0 && width >= Breakpoints.sm1 ? (
        <Modal open onClose={() => null}>
          <div className='md:w-[475px] w-[475px] pb-8 pl-6 pr-6 pt-5 rounded-2xl bg-black-800'>
            <div className='flex justify-end items-center w-full h-[30px]'>
              <ExitIcon className='hover:cursor-pointer' onClick={close} />
            </div>
            <div className='flex flex-col items-center justify-center w-full gap-6'>
              <div className='text-2xl font-semibold '>{t("errorConnecting")}</div>
              <AlertTriangle />
              <div className='text-[15px] text-center px-6 text-grey-400'>
                {
                  "The connection attempt failed. Please click try again and follow the steps to connect in your wallet."
                }
              </div>
            </div>
            <div className='px-20 py-6'>
              <PrimaryButton className='justify-center w-full text-lg' onClick={() => {}}>
                {t("buttons.tryAgain")}
              </PrimaryButton>
            </div>
            <div
              onClick={close}
              className='flex items-center text-[15px] justify-center text-grey-400 hover:text-white hover: cursor-pointer'>
              {t("backToWallets")}
            </div>
          </div>
        </Modal>
      ) : (
        <div>
          <BottomSheetOptions title='Error' open={false} setOpen={close}>
            <div className='pt-5 pb-8 pl-6 pr-6 rounded-2xl bg-black-800'>
              <div className='flex flex-col items-center justify-center w-full gap-6'>
                <div className='text-xl font-semibold '>{t("errorConnecting")}</div>
                <AlertTriangle />
                <div className='px-6 text-sm text-center text-grey-400'>
                  {
                    "The connection attempt failed. Please click try again and follow the steps to connect in your wallet."
                  }
                </div>
              </div>
              <div className='py-6 '>
                <PrimaryButton className='justify-center w-full text-lg' onClick={() => {}}>
                  {t("buttons.tryAgain")}
                </PrimaryButton>
              </div>
              <div
                onClick={close}
                className='flex items-center text-[15px] justify-center text-grey-400 hover:text-white hover: cursor-pointer'>
                {t("backToWallets")}
              </div>
            </div>
          </BottomSheetOptions>
        </div>
      )}
    </>
  );
}

export default ConnectionErrorModal;
