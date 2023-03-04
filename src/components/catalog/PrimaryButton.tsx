import React from "react";
import { UilSpinnerAlt } from "@iconscout/react-unicons";

interface Props {
  children: React.ReactNode;
  onClick?: (e: any) => void;
  className?: String;
  loading?: boolean;
  disabled?: boolean;
  type?: "submit" | "button" | "reset";
}

function PrimaryButton({ children, disabled, loading, className = "", ...rest }: Props) {
  return (
    <button
      className={`flex items-center px-10 py-4 rounded-full font-bold text-center text-white ${
        disabled ? "bg-grey-450" : "bg-primary"
      } ${className} focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary`}
      disabled={disabled || loading}
      {...rest}>
      {children}
      {loading && (
        <span className='ml-1 animate-spin'>
          <UilSpinnerAlt />
        </span>
      )}
    </button>
  );
}

export default PrimaryButton;
