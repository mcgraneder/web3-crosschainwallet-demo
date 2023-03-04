import { useState } from "react";
import { useMultiwallet } from "src/connectors/multiwallet";
import PrimaryButton from "../catalog/PrimaryButton";
import { trimAddress } from "../../connectors/multiwallet/MultiwalletProvider";
import { getWalletConfig, } from "../../connectors/multiwallet/walletsConfig";
import { Wallet } from "../../connectors/multiwallet/walletsConfig";

import { Chain } from "@renproject/utils";
import { setChain, $wallet } from "src/features/wallet/walletSlice";
import { useDispatch, useSelector } from "react-redux";

const Sidebar = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showConnectModal, setShowConnectedModal] = useState<boolean>(false);

  const { chain } = useSelector($wallet);
  const dispatch = useDispatch();
  const toggleConnectedAccountModal = (chain: Chain) => {
    dispatch(setChain(chain));
    setShowConnectedModal(!showConnectModal);
  };
  const { enabledChains } = useMultiwallet();

  const wallets = Object.values(enabledChains);



  const mutatedArray = Array(enabledChains);

  return (
    <>
      <div className='w-screen bg-black-600 h-full z-30'>
        {showSidebar ? (
          <button
            className='flex text-4xl text-white bg-black items-center cursor-pointer fixed right-10 top-6 z-50'
            onClick={() => setShowSidebar(!showSidebar)}>
            x
          </button>
        ) : (
          <svg
            onClick={() => setShowSidebar(!showSidebar)}
            className='fixed  z-30 flex items-center cursor-pointer right-10 top-6'
            fill='#2CC995'
            viewBox='0 0 100 80'
            width='40'
            height='40'>
            <rect width='100' height='10'></rect>
            <rect y='30' width='100' height='10'></rect>
            <rect y='60' width='100' height='10'></rect>
          </svg>
        )}

        <div
          className={`top-0 right-0 w-[25vw] text-center justify-center bg-black-800  p-10 pl-10 text-white fixed h-full z-40  ease-in-out duration-300 border-l-2 border-black-600 ${
            showSidebar ? "translate-x-0 " : "translate-x-full"
          }`}>
          <h3 className='mt-10 flex text-center text-2xl font-semibold text-grey-400 mb-8'>
            Connected Wallets
          </h3>
          {wallets.map((wallet: any) => {
      
            const walletConfig = getWalletConfig(wallet.name as Wallet);
            const { Icon } = walletConfig;
            return (
              <div className='my-6' key={wallet.name}>
                {wallet.status === "connected" && (
                  <PrimaryButton
                    className='w-full font-semibold text-xl h-[60px] items-center justify-center pl-5 pr-5 '
                    onClick={() => toggleConnectedAccountModal(wallet.chain)}>
                    <div className='w-full flex gap-5 items-center justify-center'>
                      <div className='flex gap-5 justify-center items-center border-r'>
                        {wallet.account && <Icon />}
                        <span className='ml-2'> </span>
                      </div>
                      <div className='pr-3 text-[22px]'>
                        {trimAddress((wallet.account as any)?.toLowerCase(), 6)}
                      </div>
                      {/* {wallet.account && <Davatar
                                size={35}
                                address={wallet.account as string}
                                generatedAvatarType="jazzicon"
                            />} */}
                    </div>
                  </PrimaryButton>
                )}
              </div>
            );
          })}
        </div>
        {/* {showConnectModal && <ConnectedAccountModal chain={chain} />} */}
      </div>
    </>
  );
};

export default Sidebar;
