import React, { useState } from "react";
import Modal from "../modals/Modal";
import PrimaryButton from "../catalog/PrimaryButton";
import ExitIcon from "../../../public/svgs/exitIcon.svg";
import AlertTriangle from "../../../public/svgs/alertTriangle.svg";
import { useWallet, SwitchNetwork } from "src/features/wallet/walletHooks";
import { Chain } from "@renproject/chains";
import { getMultiwalletConfig } from "src/connectors/multiwallet/multiwalletConfig";
import { useMultiwallet } from "src/connectors/multiwallet";
import BottomSheetOptions from "../fund/BottomSheetOptions";
import { Breakpoints } from "src/constants/Breakpoints";
import { useViewport } from "../../hooks/useViewport";

export declare enum RenNetwork {
  Mainnet = "mainnet",
  Testnet = "testnet",
  Devnet = "devnet",
}
export declare type RenNetworkString = "mainnet" | "testnet" | "devnet";

interface UnsupportedNetworkModalProps {
  chain: Chain;
  close: () => void;
  targetNetwork: RenNetwork;
}
function UnsupportedNetworkModal({ chain, close, targetNetwork }: UnsupportedNetworkModalProps) {
  const { width } = useViewport();
  const { provider } = useWallet(chain as Chain);
  const { activateConnector } = useMultiwallet();


  const [error, setError] = useState<any>(false);

  const onClick = async () => {
    const addOrSwitchChain = await SwitchNetwork(chain as Chain, targetNetwork as any);
    if (addOrSwitchChain?.switched) {
      activateConnector(
        chain,
        getMultiwalletConfig(targetNetwork)?.chains[chain][0].connector,
        "Metamask"
      );
    }
    chain === Chain.Ethereum
      ? localStorage.setItem("providerEthereum", "Metamask")
      : localStorage.setItem("providerSolana", "Phantom");
  };
 
  // const [success, setSuccess] = useState(false);

  // const handleSwitch = useCallback(() => {
  //   console.log(addOrSwitchChain)
  //   if (addOrSwitchChain !== null) {
  //     setError(false);
  //     setPending(true);
  //     addOrSwitchChain()
  //       .then(() => {
  //         setError(false);
  //         setSuccess(true);
  //       })
  //       .catch((error: any) => {
  //         setError(error);
  //       })
  //       .finally(() => {
  //         setPending(false);
  //       });
  //   }
  // }, [addOrSwitchChain]);

  return (
    <>
      {width > 0 && width >= Breakpoints.sm1 ? (
        <Modal open onClose={() => null}>
          <div className='md:w-[475px] w-[475px] pb-8 pl-6 pr-6 pt-5 rounded-2xl bg-black-800'>
            <div className='flex justify-end items-center w-full h-[30px]'>
              <ExitIcon className='hover:cursor-pointer' onClick={close} />
            </div>
            <div className='flex flex-col items-center justify-center w-full gap-6'>
              <div className='text-2xl font-semibold '>{"Unsupported network"}</div>
              <AlertTriangle width={"75px"} />
              <div className='text-[16px] text-center px-6 text-grey-400'>
                {
                  "You are using catalog on an unsupported network. please switch to a supported chain"
                }
              </div>
            </div>
            <div className='px-20 py-6'>
              <PrimaryButton className='justify-center w-full text-lg bg-primary' onClick={onClick}>
                {"Switch Network"}
              </PrimaryButton>
            </div>
            <div
              onClick={close}
              className='flex items-center text-[15px] justify-center font-semibold text-grey-400 hover:text-white hover: cursor-pointer'>
              {"Close"}
            </div>
          </div>
        </Modal>
      ) : (
        <div>
          <BottomSheetOptions title='Error' open={error} setOpen={close}>
            <div className='pt-5 pb-8 pl-6 pr-6  rounded-2xl bg-black-800'>
              <div className='flex flex-col items-center justify-center w-full gap-6'>
                <div className='text-xl font-semibold '>{"Error Connecting"}</div>
                <AlertTriangle />
                <div className='px-6 text-sm text-center text-grey-400'>
                  {"Unsupported Chain"}
                </div>
              </div>
              <div className='py-6 '>
                <PrimaryButton className='justify-center w-full text-lg' onClick={onClick}>
                  {"Try Again"}
                </PrimaryButton>
              </div>
              <div
                onClick={close}
                className='flex items-center text-[15px] justify-center text-grey-400 hover:text-white hover: cursor-pointer'>
                {"Back To Wallets"}
              </div>
            </div>
          </BottomSheetOptions>
        </div>
      )}
    </>
  );
}

export default UnsupportedNetworkModal;
