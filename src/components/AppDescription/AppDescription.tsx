import React, { useState } from "react";
import { UilArrowLeft } from "@iconscout/react-unicons";
import Card from "../catalog/Card";
import PrimaryButton from "../catalog/PrimaryButton";
import { walletReducer } from "../../features/wallet/walletSlice";
import { MultiwalletInterface } from "../../connectors/multiwallet/MultiwalletProvider";
import { Flow } from '../Knowledge/Knowledge';

interface ModalProps {
  onBack: (nf: Flow) => void;
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

export default function AppDescription({ onBack }: ModalProps) {
  const [total, setTotal] = useState<number>(2);

  // passing () => null to onClose so it does not close on pressing outside the card
  return (
    <div className="mt-8">
      <Card dialog>
        <div className='flex items-center gap-4'>
          <Card.Title small>{"Cross chain Multiwallet"}</Card.Title>
          <StepIndicator curr={1} total={total} />
        </div>
        <Card.Description>Intoducing an effective crosschain wallet library</Card.Description>
        <Separator />
        <div>
          <ContentWrapper>
            <div className='flex flex-row gap-4 px-4 py-3 '>
              <div className='mt-2 h-4 w-4 rounded-full bg-primary'></div>
              <span className='max-w-[90%] text-[15px] text-grey-400'>
                Managing effective wallet systems for your DApp can be difficult especially as the
                amount of wallets you want to support grows.
              </span>
            </div>
            <div className='flex flex-row gap-4 px-4 py-3 '>
              <div className='mt-2 h-4 w-4 rounded-full bg-primary'></div>
              <span className='max-w-[90%] text-[15px] text-grey-400'>
                This is because handling async effects and different event emmittrs for each custom
                wallet can get cumbersome and unforseen side effects can mess up your wallet system
              </span>
            </div>
            <div className='flex flex-row gap-4 px-4 py-3 '>
              <div className='mt-2 h-4 w-4 rounded-full bg-primary'></div>
              <span className='max-w-[90%] text-[15px] text-grey-400'>
                For cross chain apps this problem gets even worse. So I have created a cross chain
                developer wallet library which makes it easy to handle wallet support for different
                chains.
              </span>
            </div>
          </ContentWrapper>
          <div className='flex justify-center'>
            <PrimaryButton
              onClick={() => onBack("step2")}
              className='mt-6 mb-0 flex w-[40%] justify-center self-center text-center'>
              Next
            </PrimaryButton>
          </div>
        </div>
      </Card>
    </div>
  );
}
