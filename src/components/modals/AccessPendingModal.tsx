import { useTranslation } from "next-i18next";
import { UilRocket, UilTimes } from "@iconscout/react-unicons";
import Modal from "src/components/modals/Modal";
import Card from "../catalog/Card";
import PrimaryButton from "../catalog/PrimaryButton";
import Link from "next/link";

interface AccessPendingProps {
  onClose: () => void;
}
const AccessPendingModal = ({ onClose }: AccessPendingProps) => {
  const { t } = useTranslation();

  return (
    <Modal open onClose={onClose}>
      <Card dialog responsiveOverride='bg-black-800' onExitIconClick={onClose} ExitIcon={UilTimes}>
        <div className='flex flex-col items-center justify-center w-full h-full gap-8 rounded-2xl'>
          <UilRocket className='w-20 h-20' />
          <div className='flex flex-col gap-4 tracking-wide text-center'>
            <h1 className='text-2xl font-bold capitalize'>
              {t("waitlistAndAccess.onTheWaitlist")}
            </h1>
            <p className='max-w-xs font-normal text-grey-400'>
              {t("waitlistAndAccess.willBeGrantedAccessSoon")}
            </p>
            <p className='max-w-xs font-normal text-grey-400'>
              {t("waitlistAndAccess.stayUpToDateOnSocials")}
              <Link passHref href='https://discord.gg/hENQGUcPaf'>
                <a className='text-primary'>{t("socials.discord")}</a>
              </Link>{" "}
              and{" "}
              <Link passHref href='https://twitter.com/catalogfi'>
                <a className='text-primary'>{t("socials.twitter")}</a>
              </Link>
              {t("waitlistAndAccess.waysToAccess")}
            </p>
          </div>
          <PrimaryButton onClick={onClose}> {t("buttons.close")} </PrimaryButton>
        </div>
      </Card>
    </Modal>
  );
};

export default AccessPendingModal;
