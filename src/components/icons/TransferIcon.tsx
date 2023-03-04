import React, { useState } from "react";

export interface TransferIconProps {
  type: "secondary" | "primary";
  toolTipText: string;
  onClick: () => void;
}

interface IconProps {
  type?: "secondary" | "primary";
  Icon: any;
  toolTipText?: string;
  onClick?: () => void;
}

interface TooltipProps {
  infoText?: string;
  infoTextStyle?: string;
  toolTipContainerStyle?: string;
  arrowStyle?: string;
  arrowDirection?: string;
  usedInTxLogs?: boolean;
}

export function Tooltip({
  toolTipContainerStyle,
  infoTextStyle,
  infoText,
  arrowStyle,
  arrowDirection,
  usedInTxLogs,
}: TooltipProps) {
  const defaultContainerStyleInTxLogs = "px-4 py-3 z-[100] tooltip bg-black-900 -top-14 rounded-xl";
  const defaultArrowStyles =
    "w-0  -top-2 h-0 border-l-[6px] border-l-transparent border-r-transparent border-r-[6px] border-t-[8px] z-[100] tooltip border-black-600 ";
  return (
    <>
      {arrowDirection === "DOWN" && <div className={` ${arrowStyle!} ${defaultArrowStyles}`}></div>}
      <span
        className={`${usedInTxLogs ? defaultContainerStyleInTxLogs : ""} ${toolTipContainerStyle!}`}>
        <span className={`${infoTextStyle!}`}>{infoText}</span>
        {arrowDirection === "TOP_LEFT" && (
          <div className={` ${arrowStyle!} rotate-[135deg] ${defaultArrowStyles}`}></div>
        )}
      </span>
    </>
  );
}

function IconButton({ Icon, type = "primary", toolTipText, ...rest }: IconProps) {
  const colors =
    type === "primary"
      ? "text-primary bg-black-900"
      : "text-grey-400 bg-black-700 hover:bg-black-600 hover:text-white";
  return (
    <div className='has-tooltip flex justify-center'>
      {toolTipText && (
        <Tooltip
          infoText={toolTipText}
          toolTipContainerStyle='flex flex-col items-center px-3 py-2 overflow-visible font-semibold bg-black-600 rounded-xl w-max tooltip -top-12 '
          arrowDirection='DOWN'
        />
      )}
      <button
        className={`${colors} flex items-center gap-2 rounded-full p-4 font-semibold`}
        {...rest}>
        <Icon className='h-6 w-6 ' />
      </button>
    </div>
  );
}

export default function TransferIcon({ type, toolTipText, onClick }: TransferIconProps) {
  const [color, setColor] = useState("#9B9B9C");
  return (
    <div
      className='flex items-center font-semibold rounded-full'
      onMouseEnter={() => setColor("white")}
      onMouseLeave={() => setColor("#9B9B9C")}>
      <IconButton
        type={type}
        onClick={onClick}
        toolTipText={toolTipText}
        Icon={() => <TransferIconSVG color={color} />}
      />
    </div>
  );
}

const TransferIconSVG = ({ color }: { color: string }) => {
  return (
    <div>
      <svg
        width='24'
        height='24'
        viewBox='0 0 20 17'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'>
        <path
          d='M9.99992 7.99935C9.50546 7.99935 9.02211 8.14597 8.61099 8.42068C8.19987 8.69538 7.87944 9.08583 7.69022 9.54264C7.501 9.99946 7.45149 10.5021 7.54795 10.9871C7.64442 11.472 7.88252 11.9175 8.23215 12.2671C8.58178 12.6167 9.02724 12.8548 9.51219 12.9513C9.99714 13.0478 10.4998 12.9983 10.9566 12.809C11.4134 12.6198 11.8039 12.2994 12.0786 11.8883C12.3533 11.4772 12.4999 10.9938 12.4999 10.4993C12.4999 9.83631 12.2365 9.20042 11.7677 8.73158C11.2988 8.26274 10.663 7.99935 9.99992 7.99935ZM9.99992 11.3327C9.8351 11.3327 9.67398 11.2838 9.53694 11.1922C9.3999 11.1007 9.29309 10.9705 9.23002 10.8183C9.16694 10.666 9.15044 10.4984 9.1826 10.3368C9.21475 10.1751 9.29412 10.0266 9.41066 9.91009C9.52721 9.79355 9.67569 9.71418 9.83734 9.68203C9.99899 9.64987 10.1665 9.66638 10.3188 9.72945C10.4711 9.79252 10.6012 9.89933 10.6928 10.0364C10.7844 10.1734 10.8333 10.3345 10.8333 10.4993C10.8333 10.7204 10.7455 10.9323 10.5892 11.0886C10.4329 11.2449 10.2209 11.3327 9.99992 11.3327ZM15.8333 10.4993C15.8333 10.3345 15.7844 10.1734 15.6928 10.0364C15.6012 9.89933 15.4711 9.79252 15.3188 9.72945C15.1665 9.66638 14.999 9.64987 14.8373 9.68203C14.6757 9.71418 14.5272 9.79355 14.4107 9.91009C14.2941 10.0266 14.2148 10.1751 14.1826 10.3368C14.1504 10.4984 14.1669 10.666 14.23 10.8183C14.2931 10.9705 14.3999 11.1007 14.5369 11.1922C14.674 11.2838 14.8351 11.3327 14.9999 11.3327C15.2209 11.3327 15.4329 11.2449 15.5892 11.0886C15.7455 10.9323 15.8333 10.7204 15.8333 10.4993ZM16.6666 4.66602H14.1666C13.9456 4.66602 13.7336 4.75381 13.5773 4.91009C13.421 5.06637 13.3333 5.27834 13.3333 5.49935C13.3333 5.72036 13.421 5.93232 13.5773 6.0886C13.7336 6.24489 13.9456 6.33268 14.1666 6.33268H16.6666C16.8876 6.33268 17.0996 6.42048 17.2558 6.57676C17.4121 6.73304 17.4999 6.945 17.4999 7.16602V13.8327C17.4999 14.0537 17.4121 14.2657 17.2558 14.4219C17.0996 14.5782 16.8876 14.666 16.6666 14.666H3.33325C3.11224 14.666 2.90028 14.5782 2.744 14.4219C2.58772 14.2657 2.49992 14.0537 2.49992 13.8327V7.16602C2.49992 6.945 2.58772 6.73304 2.744 6.57676C2.90028 6.42048 3.11224 6.33268 3.33325 6.33268H5.83325C6.05427 6.33268 6.26623 6.24489 6.42251 6.0886C6.57879 5.93232 6.66658 5.72036 6.66658 5.49935C6.66658 5.27834 6.57879 5.06637 6.42251 4.91009C6.26623 4.75381 6.05427 4.66602 5.83325 4.66602H3.33325C2.67021 4.66602 2.03433 4.92941 1.56548 5.39825C1.09664 5.86709 0.833252 6.50297 0.833252 7.16602V13.8327C0.833252 14.4957 1.09664 15.1316 1.56548 15.6005C2.03433 16.0693 2.67021 16.3327 3.33325 16.3327H16.6666C17.3296 16.3327 17.9655 16.0693 18.4344 15.6005C18.9032 15.1316 19.1666 14.4957 19.1666 13.8327V7.16602C19.1666 6.50297 18.9032 5.86709 18.4344 5.39825C17.9655 4.92941 17.3296 4.66602 16.6666 4.66602ZM4.16658 10.4993C4.16658 10.6642 4.21546 10.8253 4.30703 10.9623C4.39859 11.0994 4.52874 11.2062 4.68102 11.2692C4.83329 11.3323 5.00084 11.3488 5.16249 11.3167C5.32414 11.2845 5.47263 11.2051 5.58917 11.0886C5.70572 10.9721 5.78508 10.8236 5.81724 10.6619C5.84939 10.5003 5.83289 10.3327 5.76982 10.1804C5.70674 10.0282 5.59993 9.89803 5.46289 9.80646C5.32585 9.71489 5.16474 9.66602 4.99992 9.66602C4.7789 9.66602 4.56694 9.75381 4.41066 9.91009C4.25438 10.0664 4.16658 10.2783 4.16658 10.4993Z'
          fill={color}
        />
        <path d='M7.5 3L12.5 3' stroke={color} strokeWidth='1.6' strokeLinecap='round' />
        <path d='M12.5 3L10.5 1' stroke={color} strokeWidth='1.6' strokeLinecap='round' />
        <path
          d='M10.5 5.09961L12.5 3.09961'
          stroke={color}
          strokeWidth='1.6'
          strokeLinecap='round'
        />
      </svg>
    </div>
  );
};
