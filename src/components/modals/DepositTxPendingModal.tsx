import { useTranslation } from "next-i18next";
import { UilTimes } from "@iconscout/react-unicons";

import Modal from "src/components/modals/Modal";
import Card from "../catalog/Card";
import Gears from "/public/svgs/gears.svg";
import PrimaryButton from "../catalog/PrimaryButton";
import { useRouter } from "next/router";

interface TxnProcessLoaderProps {
  onClose: () => void;
}
const DepositTxPendingModal = ({ onClose }: TxnProcessLoaderProps) => {
  const { t } = useTranslation();
  const router = useRouter();

  const onClick = () => {
    router.push("/transactions");
  };

  return (
    <Modal open onClose={onClose}>
      <Card className='bg-black-800' dialog onExitIconClick={onClose} ExitIcon={UilTimes}>
        <div className='flex flex-col items-center justify-center gap-8 mt-10 rounded-2xl bg-black-800'>
          <Gears />
          <div className='flex flex-col gap-4 tracking-wide text-center'>
            <h1 className='text-2xl font-bold capitalize'>{t("others.txHasBeenSubmitted")}</h1>
            <p className='font-normal ml-3 mr-3 text-grey-400'>
              {t("actionDescriptors.txIsBeingProcessedDesc")}
            </p>
          </div>
          <PrimaryButton onClick={onClick}> {t("buttons.viewTxLog")} </PrimaryButton>
        </div>
      </Card>
    </Modal>
  );
};

export default DepositTxPendingModal;
