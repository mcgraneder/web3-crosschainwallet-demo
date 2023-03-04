import { useTranslation } from "next-i18next";
import { UilRocket, UilTimes } from "@iconscout/react-unicons";
import Modal from "src/components/modals/Modal";
import Card from "../catalog/Card";
import PrimaryButton from "../catalog/PrimaryButton";

interface AccessPendingProps {
  onClose: () => void;
}
const ConnectAgainModal = ({ onClose }: AccessPendingProps) => {
  const { t } = useTranslation();

  return (
    <Modal open onClose={onClose}>
      <Card dialog onExitIconClick={onClose} ExitIcon={UilTimes}>
        <div className='flex flex-col items-center justify-center gap-8 mt-10 rounded-2xl bg-black-800'>
          <UilRocket className='w-20 h-20' />
          <div className='flex flex-col gap-4 tracking-wide text-center'>
            <h1 className='text-2xl font-bold capitalize'>
              {t("connectAgainModal.accessBlocked")}
            </h1>
            <p className='font-normal text-grey-400'>{t("connectAgainModal.tryConnectingAgain")}</p>
          </div>
          <PrimaryButton onClick={onClose}> {t("buttons.close")} </PrimaryButton>
        </div>
      </Card>
    </Modal>
  );
};

export default ConnectAgainModal;
