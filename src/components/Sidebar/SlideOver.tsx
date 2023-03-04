import { Fragment } from "react";
import { Transition } from "@headlessui/react";
import { Dialog } from "@headlessui/react";
import {
  UilTimes,
  UilExternalLinkAlt,
  UilPlus,
  UilCheckCircle,
  UilCopy,
} from "@iconscout/react-unicons";
import { useMultiwallet, trimAddress } from "../../connectors/multiwallet/MultiwalletProvider";
import PrimaryButton from "src/components/catalog/PrimaryButton";
import { getWalletConfig } from "../../connectors/multiwallet/walletsConfig";
import { useSelector } from "react-redux";
import { $wallet } from "src/features/wallet/walletSlice";
import { Wallet } from "../../connectors/multiwallet/walletsConfig";
import EthereumLog from "../../../public/svgs/Eth.svg";
import SolanaLogo from "../../../public/svgs/Solana.svg";
import { Chain } from "@renproject/chains";
import useCopy from "../../hooks/useCopy";

export type Slideover = {
  open: boolean;
  setOpen: any;
  toggleWalletModal: () => void;
  disconnect: () => void;
};

export function CopyHelper(props: { toCopy: string; children?: React.ReactNode }) {
  const [isCopied, setCopied] = useCopy();

  return (
    <div
      className='  flex items-center justify-center gap-1 hover:cursor-pointer mr-2 hover:text-white'
      onClick={() => setCopied(props.toCopy)}>
      {isCopied ? (
        <div className='flex gap-1'>
          <UilCheckCircle color={"#a3a3a3"} size={"20"} />
          <div>
            <div className='text-grey-400'>{"copied"}</div>
          </div>
        </div>
      ) : (
        <div className=''>
          <UilCopy color={"#a3a3a3"} size={"20"} />
        </div>
      )}
      {isCopied ? "" : props.children}
    </div>
  );
}

export default function SlideOver({ open, setOpen, toggleWalletModal }: Slideover) {
  const { enabledChains } = useMultiwallet();
  const { chain } = useSelector($wallet);
  //make map only use enabled chains with connected status
  const wallets = Object.values(enabledChains);
  const address = enabledChains[chain]?.account;
  const walletAction = () => {
    setOpen(false);
    toggleWalletModal();
  };

  const deactivate = async (chain: string) => {
    if (chain !== Chain.Ethereum) enabledChains[chain]?.connector.deactivate();
    else {
      for (const chain of Object.keys(enabledChains)) {
        enabledChains[chain]?.connector.deactivate();
      }
    }
  };

  

   
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as='div' className='relative z-10 ' onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter='ease-in-out duration-500'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in-out duration-500'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'>
          <div className='fixed inset-0 md:opacity-70 backdrop-blur-md bg-black-900 transition-opacity' />
        </Transition.Child>

        <div className='fixed inset-0 overflow-hidden'>
          <div className='absolute inset-0 overflow-hidden'>
            <div className='pointer-events-none fixed inset-y-0 -right-0 flex max-w-full pl-10'>
              <Transition.Child
                as={Fragment}
                enter='transform transition ease-in-out duration-500 sm:duration-700'
                enterFrom='translate-x-full'
                enterTo='translate-x-0'
                leave='transform transition ease-in-out duration-500 sm:duration-700'
                leaveFrom='translate-x-0'
                leaveTo='translate-x-full'>
                <Dialog.Overlay className='pointer-events-auto relative w-screen max-w-lg'>
                  <Transition.Child
                    as={Fragment}
                    enter='ease-in-out duration-300'
                    enterFrom='opacity-0'
                    enterTo='opacity-100'
                    leave='ease-in-out duration-300'
                    leaveFrom='opacity-100'
                    leaveTo='opacity-0'>
                    <div className='absolute top-0 left-0 -ml-8 flex pt-4 pr-2 sm:-ml-10 sm:pr-4'>
                      <button
                        type='button'
                        className='rounded-md text-primary border-primary focus:ring-2 focus:ring-primary'
                        onClick={() => setOpen(false)}>
                        <UilTimes className='h-6 w-6' aria-hidden='true' />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className='flex h-full flex-col bg-black-800 py-6 px-6 shadow-xl'>
                    <div className='px-3 sm:px-6 gap-10 flex items-center justify-between'>
                      <Dialog.Title className='text-2xl font-semibold text-white'>
                        {"Active Wallets"}
                      </Dialog.Title>
                      <PrimaryButton
                        className={"flex h-[40px] bg-grey-600 gap-2"}
                        onClick={walletAction}>
                        <span>{"Add Wallets"}</span>
                        <UilPlus className='w-5 h-5' />
                      </PrimaryButton>
                    </div>
                    <div className='px-3 my-6 sm:px-6 gap-10 flex items-center justify-between'>
                      <Dialog.Description className='text-grey-400 '>
                        {"Wallet Description"}
                      </Dialog.Description>
                    </div>
                    {wallets.map((wallet: any) => {
                      const walletConfig = getWalletConfig(wallet.name as Wallet);
                      const { Icon } = walletConfig;
                      return (
                        <>
                          {wallet.status === "connected" && (
                            <div
                              className='w-full px-4 pb-6 pt-3 my-4 rounded-2xl bg-black-700'
                              key={chain}>
                              <div className='w-full h-10 flex gap-2 pb-2 items-center'>
                                {wallet.chain === Chain.Ethereum ? <EthereumLog /> : <SolanaLogo />}
                                <div className='text-white py-2 pl-2 font-semibold text-lg '>
                                  {wallet.chain}
                                </div>
                              </div>
                              <div className='flex justify-between w-full h-[30px]'>
                                <div className='flex font-semibold items-center text-md text-grey-400'>
                                  {`Connected with ${wallet?.name}`}
                                </div>
                                <div className='flex items-center justify-center gap-[10px]'>
                                  <div
                                    onClick={() => {}}
                                    className='flex items-center justify-center w-2 h-2 bg-primary rounded-full'
                                  />
                                  <div className='text-sm font-semibold text-primary hover:text-primary'>
                                    {"mainnet"}
                                  </div>
                                </div>
                              </div>
                              <div className='flex w-full h-[30px] justify-between px-1 my-4 items-center'>
                                <div className='flex items-center gap-3'>
                                  <Icon />
                                  <div className='font-semibold text-lg text-white'>
                                    {trimAddress(wallet?.account as string, 6)}
                                  </div>
                                </div>
                                <div className='flex gap-1 float-right jusitfy-right'>
                                  {wallet?.account && (
                                    <CopyHelper toCopy={wallet?.account as string}>
                                      <div className='flex'>
                                        <div className='text-normal text-grey-400'>{"Copy"}</div>
                                      </div>
                                    </CopyHelper>
                                  )}
                                  <a
                                    href={
                                      wallet.chain === "Ethereum"
                                        ? `https://etherscan.io/address/${wallet.account}`
                                        : `https://explorer.solana.com/address${wallet.account}`
                                    }
                                    target='_blank'
                                    rel='noreferrer'
                                    className='flex gap-1 mr-2 hover:cursor-pointer'>
                                    <UilExternalLinkAlt size={"20px"} className='text-grey-400' />
                                    <div className='text-normal text-grey-400'>Explorer</div>
                                    <div className='text-normal text-grey-400'>{""}</div>
                                  </a>
                                </div>
                              </div>
                              <div
                                onClick={() => deactivate(wallet.chain)}
                                className='mt-2 flex items-center justify-center p-2 border-2 border-primary hover:cursor-pointer rounded-3xl'>
                                <div className='text-sm font-semibold text-primary hover:text-primary'>
                                  {"disconnect"}
                                </div>
                              </div>
                              <div className='flex w-full'></div>
                            </div>
                          )}
                        </>
                      );
                    })}
                  </div>
                </Dialog.Overlay>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
