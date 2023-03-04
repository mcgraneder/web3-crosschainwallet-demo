import React from "react";
import Modal from "../modals/Modal";
import ExitIcon from "../../../public/svgs/exitIcon.svg";
import PrimaryButton from "src/components/catalog/PrimaryButton";
import AlertTriangle from "../../../public/svgs/alertTriangle.svg";
import { useViewport } from "../../hooks/useViewport";
import { Breakpoints } from "../../constants/Breakpoints";
import BottomSheetOptions from "../fund/BottomSheetOptions";

interface ConnectionErrorModalProps {
  close: () => void;
}
function ConnectionErrorModal({ close }: ConnectionErrorModalProps) {
  const { width } = useViewport();

  return (
    <>
      {width > 0 && width >= Breakpoints.sm1 ? (
        <Modal open onClose={() => null}>
          <div className='w-[475px] rounded-2xl bg-black-800 pb-8 pl-6 pr-6 pt-5 md:w-[475px]'>
            <div className='flex h-[30px] w-full items-center justify-end'>
              <ExitIcon className='hover:cursor-pointer' onClick={close} />
            </div>
            <div className='flex w-full flex-col items-center justify-center gap-6'>
              <div className='text-2xl font-semibold '>{"Error Connecting"}</div>
              <AlertTriangle />
              <div className='px-6 text-center text-[15px] text-grey-400'>
                {
                  "The connection attempt failed. Please click try again and follow the steps to connect in your wallet."
                }
              </div>
            </div>
            <div className='px-20 py-6'>
              <PrimaryButton className='w-full justify-center text-lg' onClick={() => {}}>
                {"Try Again"}
              </PrimaryButton>
            </div>
            <div
              onClick={close}
              className='hover: flex cursor-pointer items-center justify-center text-[15px] text-grey-400 hover:text-white'>
              {"Back To Wallets"}
            </div>
          </div>
        </Modal>
      ) : (
        <div>
          <BottomSheetOptions title='Error' open={false} setOpen={close}>
            <div className='rounded-2xl bg-black-800 pt-5 pb-8 pl-6 pr-6'>
              <div className='flex w-full flex-col items-center justify-center gap-6'>
                <div className='text-xl font-semibold '>{"Error Connecting"}</div>
                <AlertTriangle />
                <div className='px-6 text-center text-sm text-grey-400'>
                  {
                    "The connection attempt failed. Please click try again and follow the steps to connect in your wallet."
                  }
                </div>
              </div>
              <div className='py-6 '>
                <PrimaryButton className='w-full justify-center text-lg' onClick={() => {}}>
                  {"Try Again"}
                </PrimaryButton>
              </div>
              <div
                onClick={close}
                className='hover: flex cursor-pointer items-center justify-center text-[15px] text-grey-400 hover:text-white'>
                {"Back To Wallets"}
              </div>
            </div>
          </BottomSheetOptions>
        </div>
      )}
    </>
  );
}

export default ConnectionErrorModal;
