import { useTranslation } from "next-i18next";
import { UilExclamationCircle, UilTimes } from "@iconscout/react-unicons";
import Modal from "src/components/modals/Modal";
import Card from "../catalog/Card";
import PrimaryButton from "../catalog/PrimaryButton";
import { useMetaversalAccount } from "src/contexts/useMetaversalAccount";

interface NotInWaitlistProps {
  onClose: () => void;
}
const NotInWaitlistModal = ({ onClose }: NotInWaitlistProps) => {
  const { t } = useTranslation();
  const { email } = useMetaversalAccount();

  const onClick = () => {
    window.location.href = `https://catalog.fi?email=${email}`;
  };

  return (
    <Modal open onClose={onClose}>
      <Card dialog onExitIconClick={onClose} ExitIcon={UilTimes}>
        <div className='flex flex-col items-center justify-center gap-8 mt-10 rounded-2xl bg-black-800'>
          <UilExclamationCircle className='w-20 h-20' />
          <div className='flex flex-col gap-4 tracking-wide text-center'>
            <h1 className='text-2xl font-bold capitalize'>{t("others.uhoh")}</h1>
            <p className='max-w-xs font-normal text-grey-400'>
              {t("waitlistAndAccess.couldNotFindInWaitlist")}
            </p>
          </div>
          <PrimaryButton onClick={onClick}> {t("buttons.joinWaitlist")} </PrimaryButton>
        </div>
      </Card>
    </Modal>
  );
};

export default NotInWaitlistModal;
