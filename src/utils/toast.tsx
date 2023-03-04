import { toast } from "react-toastify";
import { ToastContainerProps, ToastProps } from "react-toastify/dist/types";
import { Notification } from "src/layouts/default/Notification";
import { UilCheckCircle, UilExclamationTriangle } from "@iconscout/react-unicons";

type ToastParamProps = {
  closeToast: () => void;
  toastProps: ToastProps;
};

const success = (title: string, description?: string, config?: ToastContainerProps) => {
  toast.success(
    ({ ...props }: ToastParamProps) => (
      <Notification title={title} description={description} {...props} />
    ),
    {
      icon: <UilCheckCircle size='30px' className='text-primary' />,
      progressClassName: "!bg-primary",
      ...config,
    }
  );
};

const error = (title: string, description?: string, config?: ToastContainerProps) => {
  toast.error(
    ({ ...props }: ToastParamProps) => (
      <Notification title={title} description={description} {...props} />
    ),
    {
      icon: <UilExclamationTriangle size='30px' className='text-danger' />,
      progressClassName: "!bg-danger",
      ...config,
    }
  );
};

export const Toast = { success, error };
