import { ToastProps } from "react-toastify/dist/types";

type NotificationProps = {
  title: string;
  description?: string;
  closeToast: () => void;
  toastProps: ToastProps;
};

export const Notification = ({ title, description, closeToast, toastProps }: NotificationProps) => {
  // const titleColor = `${toastProps.type === "success" ? "text-primary" : "text-red-500"}`;

  return (
    <div>
      <div className={`font-bold break-words leading-6 text-base`}>{title}</div>
      <div className='text-sm font-semibold break-words text-grey-400'>{description}</div>
    </div>
  );
};
