import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { UilSync, UilMoneyBill } from "@iconscout/react-unicons";

import AccountMenu from "./AccountMenu";

import LogoFull from "public/svgs/logo-full.svg";
import Logo from "public/svgs/logo-icon.svg";
import ActiveTabIndicator from "public/svgs/active-tab-indicator.svg";
import { DashboardIcon } from "src/components/icons/DashboardIcon";
import { WalletData } from "../../features/wallet/walletHooks";

export type NavItemProps = { route: string; Icon: any; label: string; inMaintenance: boolean };

interface NavigationBarProps {
  setShowAccount?: React.Dispatch<React.SetStateAction<boolean>>;
  toggleWalletModal?: () => void;
  disconnect?: () => void;
  multiwallet?: WalletData;
  inMaintenance?: boolean;
}

const NavItem = ({ route, Icon, label, inMaintenance = false }: NavItemProps) => {
  const { pathname } = useRouter();

  return (
    <Link href={route} passHref>
      <a
        className={`relative ${
          inMaintenance ? "pointer-events-none" : ""
        } flex items-center h-full p-4`}>
        {pathname === route && (
          <ActiveTabIndicator className='absolute bottom-0 left-0 right-0 flex w-full self-end mx-auto mt-auto h-[7px]' />
        )}
        <span
          className={`flex  items-center gap-4 text-lg font-semibold ${
            pathname === route && `text-primary`
          } ${inMaintenance && "text-grey-450"}`}>
          <Icon color={inMaintenance ? "#7A7A7A" : pathname === route ? "#2CC995" : "#FAFAFA"} />
          {label}
        </span>
      </a>
    </Link>
  );
};

function NavigationBar({
  toggleWalletModal,
  setShowAccount,
  disconnect,
  multiwallet,
  inMaintenance = false,
}: NavigationBarProps) {
  const router = useRouter();
  const reload = () => {
    router.reload();
  };

  return (
    <nav className='w-full'>
      <div className='relative grid items-center grid-cols-2 lg:grid-cols-[0.5fr_1fr_0.5fr] lg:px-12'>
        <div className='px-3 py-4 xs:px-0 xs:py-6'>
          <div onClick={reload} className='hover:cursor-pointer'>
            <a className='flex items-center w-max'>
              <LogoFull className='hidden xs:block' />
              <Logo className='w-8 h-8 xs:hidden' />
              {/* <span className='px-2 shadow-xl flex justify-center items-center -translate-y-3 xs:-translate-y-2 py-1 text-[10px] -translate-x-2 sm:-translate-x-4  bg-[#ec4388] font-semibold rounded-2xl'>
              BETA
            </span> */}
            </a>
          </div>
        </div>
        <div className='relative items-center justify-center hidden h-full lg:gap-10 xl:gap-18 lg:flex'>
          {/* <NavItem route='/stake' Icon={UilMoneyStack} label={t("navigationLabels.stake")} /> */}
          <NavItem
            inMaintenance={inMaintenance}
            route='/fund'
            Icon={UilMoneyBill}
            label={"fund"}
          />
        </div>
        {!inMaintenance && (
          <div className='flex items-center justify-end'>
            <AccountMenu
              toggleWalletModal={toggleWalletModal as any}
              setShowAccount={setShowAccount}
              disconnect={disconnect}
              multiwallet={multiwallet as WalletData}
            />
          </div>
        )}
      </div>
    </nav>
  );
}

export default NavigationBar;
