import React, { useState } from "react";
import { UilArrowLeft } from "@iconscout/react-unicons";
import Card from "../catalog/Card";
import PrimaryButton from "../catalog/PrimaryButton";
import { walletReducer } from '../../features/wallet/walletSlice';
import { MultiwalletInterface } from "../../connectors/multiwallet/MultiwalletProvider";
import BinanceChainWallet from "../../../public/svgs/wallets/BinanceChainWallet.svg";
import CoinbaseWallet from "../../../public/svgs/wallets/CoinbaseWallet.svg";
import MetaMaskWallet from "../../../public/svgs/wallets/MetaMaskWallet.svg";
import MyEtherWallet from "../../../public/svgs/wallets/MyEtherWallet.svg";
import PhantomWallet from "../../../public/svgs/wallets/PhantomWallet.svg";
import SolletWallet from "../../../public/svgs/wallets/SolletWallet.svg";

interface ModalProps {
  onBack: () => void;
}

interface SeparatorProps {
  className?: string;
}

interface Props {
  children: React.ReactNode;
  label?: string;
  rightLabel?: string;
  rightLabelClassName?: string;
  rightLabelOnClick?: () => void;
  overrideSmallScreenStyle?: boolean;
}

function ContentWrapper(props: Props) {
  const {
    children,
    label,
    rightLabel,
    rightLabelOnClick,
    rightLabelClassName,
    overrideSmallScreenStyle,
  } = props;

  function handleRightLabelClick(e: any) {
    e?.preventDefault();
    e?.stopPropagation();
    rightLabelOnClick?.();
  }

  const RightLabel = (
    <p className={`mt-1 mb-2 mr-1 text-sm font-semibold tracking-wide ${rightLabelClassName}`}>
      {rightLabel}
    </p>
  );
  return (
    <div
      className={`rounded-2xl p-1 ${
        overrideSmallScreenStyle ? "bg-black-900" : `bg-black-800 md:bg-black-900`
      }`}>
      <div className='mx-3 flex items-center justify-between'>
        {rightLabel && rightLabelOnClick && (
          <button onClick={handleRightLabelClick}>{RightLabel}</button>
        )}
        {rightLabel && !rightLabelOnClick && RightLabel}
      </div>
      <div>{children}</div>
    </div>
  );
}

const Step = ({ active }: { active?: boolean }) => {
  return (
    <div className={`h-1 w-6 rounded-sm sm:w-10 ${active ? "bg-primary" : "bg-black-700"}`}></div>
  );
};

const StepIndicator = ({ curr, total }: { curr: number; total: number }) => {
  return (
    <div className='translate-y-1 self-start'>
      <p className='mb-1 text-xs font-semibold tracking-wide'>
        Step {curr} of {total}
      </p>
      <div className='flex gap-1'>
        {Array(curr)
          .fill(null)
          .map((_, i) => (
            <Step key={`active-${i}`} active />
          ))}
        {Array(total - curr)
          .fill(null)
          .map((_, i) => (
            <Step key={`inactive-${i}`} />
          ))}
      </div>
    </div>
  );
};

export function Separator({ className = "" }: SeparatorProps) {
  return <hr className={` ${className} my-4 border-black-600`} />;
}

export default function Step2({ onBack }: ModalProps) {
  const [total, setTotal] = useState<number>(2);

  // passing () => null to onClose so it does not close on pressing outside the card
  return (
    <div className='mt-8'>
      <Card dialog onExitIconClick={onBack} ExitIcon={UilArrowLeft}>
        <div className='flex items-center gap-4'>
          <Card.Title small>{"How Does It Work"}</Card.Title>
          <StepIndicator curr={2} total={total} />
        </div>

        <Separator />
        <div>
          <ContentWrapper>
            <div className='flex flex-row gap-4 px-4 py-3 '>
              <div className='mt-2 h-4 w-4 rounded-full bg-primary'></div>
              <div className='flex flex-col items-center justify-center gap-2'>
                <span className='max-w-[90%] text-[15px] text-grey-400'>
                  My library is under development and currently only supports{" "}
                  <span className='text-primary'>Ethereum,</span>{" "}
                  <span className='text-primary'>Solana</span> and{" "}
                  <span className='text-primary'>Binance</span>
                </span>
                <div className='mt-2 flex w-[70%] flex-row justify-between gap-2'>
                  <MetaMaskWallet height={32} width={32} />
                  <PhantomWallet height={32} width={32} />
                  <BinanceChainWallet height={32} width={32} />
                </div>
              </div>
            </div>
            <div className='flex flex-row gap-4 px-4 py-3 '>
              <div className='mt-2 h-4 w-4 rounded-full bg-primary'></div>
              <span className='max-w-[90%] text-[15px] text-grey-400'>
                To start click the connect button above.{" "}
                <span className='text-primary'>You must connect to Ethereum First</span>. then you
                can connect to both Binance wallet and solana wallets. Make sure you have the
                require wallets extensions installed or the connection will fail
              </span>
            </div>
            <div className='flex flex-row gap-4 px-4 py-3 '>
              <div className='mt-2 h-4 w-4 rounded-full bg-primary'></div>
              <span className='max-w-[90%] text-[15px] text-grey-400'>
                You can Then View your active wallets by clicking the{" "}
                <span className='text-primary'>View Accounts</span> Menu and manage you different
                connections there
              </span>
            </div>
            <div className='flex flex-row gap-4 px-4 py-3 '>
              <div className='mt-2 h-4 w-4 rounded-full bg-primary'></div>
              <span className='max-w-[90%] text-[15px] text-primary'>
                This Demo is a work in progress and there are bugs I have to fix aswell as other
                non EVM chains to include
              </span>
            </div>
          </ContentWrapper>
        </div>
      </Card>
    </div>
  );
}
