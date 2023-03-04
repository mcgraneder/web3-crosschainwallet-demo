import {
  UilUserCircle,
  UilSignOutAlt,
  UilAngleDown,
} from "@iconscout/react-unicons";
import { Menu, Transition } from "@headlessui/react";
import React from "react";
import { WalletData } from "../../features/wallet/walletHooks";

interface AccountMenuProps {
  setShowAccount?: React.Dispatch<React.SetStateAction<boolean>>;
  toggleWalletModal: () => void;
  disconnect?: () => void;
  multiwallet: WalletData;
}

function AccountMenu({
  toggleWalletModal,
  setShowAccount,
  disconnect,
  multiwallet,
}: AccountMenuProps) {
  const { connected } = multiwallet;

  const btnStyle =
    "flex items-center gap-2 px-3 py-2 text-lg font-semibold rounded-lg hover:bg-black-600 ";

  const menuItemStyle =
    "flex hover:text-white items-center gap-2 p-3 font-semibold hover:bg-grey-600";


  return (
    <>
      {connected ? (
        <Menu as='div' className='relative inline-block text-left '>
          <Menu.Button className={`${btnStyle} min-w-[190px] justify-center relative`}>
            <span>{"View Accounts"}</span>
            <span className='relative'>
              <UilUserCircle />
             
            </span>
          </Menu.Button>

          <Transition
            as={React.Fragment}
            enter='transition ease-out duration-100'
            enterFrom='transform opacity-0 scale-95'
            enterTo='transform opacity-100 scale-100'
            leave='transition ease-in duration-75'
            leaveFrom='transform opacity-100 scale-100'
            leaveTo='transform opacity-0 scale-95'>
            <Menu.Items className='absolute min-w-[170px] w-max left-0 right-0 z-40 flex flex-col ml-auto rounded-2xl bg-[#25272b] '>
              <hr className='border-black-600' />
              <Menu.Item>
                <button className={`${menuItemStyle}`} onClick={() => setShowAccount?.(true)}>
                  <UilUserCircle className='w-6' />
                  {"Account"}
                </button>
              </Menu.Item>
              <hr className='border-black-600' />
              <Menu.Item>
                <button className={`${menuItemStyle} rounded-b-2xl`} onClick={disconnect}>
                  <UilSignOutAlt className='w-6' />
                  {"Disconnect"}
                </button>
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      ) : (
        <>
          <button
            onClick={() => {
              toggleWalletModal?.();
            }}
            className={btnStyle + " justify-center"}>
            {"Connect Wallet"}
            <UilUserCircle />
          </button>
          <Menu as='div' className='sm:hidden'>
            <Menu.Button className='flex items-center'>
              <UilAngleDown className='mr-2' />
            </Menu.Button>
            <Transition
              as={React.Fragment}
              enter='transition ease-out duration-100'
              enterFrom='transform opacity-0 scale-95'
              enterTo='transform opacity-100 scale-100'
              leave='transition ease-in duration-75'
              leaveFrom='transform opacity-100 scale-100'
              leaveTo='transform opacity-0 scale-95'>
              <Menu.Items className='absolute z-20 flex flex-col mx-auto shadow-2xl right-4 rounded-2xl bg-[#25272b] '>
                
              </Menu.Items>
            </Transition>
          </Menu>
        </>
      )}
    </>
  );
}

export default AccountMenu;
