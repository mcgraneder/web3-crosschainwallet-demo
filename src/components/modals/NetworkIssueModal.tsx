import { useTranslation } from "next-i18next";
import { UilTimes, UilCloudSlash } from "@iconscout/react-unicons";
import Modal from "src/components/modals/Modal";
import Card from "../catalog/Card";
import PrimaryButton from "../catalog/PrimaryButton";

interface NetworkIssueModalProps {
  onClose: () => void;
}
const NetworkIssueModal = ({ onClose }: NetworkIssueModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal open onClose={onClose}>
      <Card className='bg-black-800' dialog onExitIconClick={onClose} ExitIcon={UilTimes}>
        <div className='flex flex-col items-center justify-center gap-8 mt-10 rounded-2xl bg-black-800'>
          <UilCloudSlash size={"130px"} className='text-red-500' />
          <div className='flex flex-col gap-4 tracking-wide text-center'>
            <h1 className='text-2xl font-bold capitalize'>
              {t("networkIssuesModalCopy.networkIssues")}
            </h1>
            <p className='font-normal ml-3 mr-3 text-grey-400'>
              {t("networkIssuesModalCopy.txSafelyProcessing")}
            </p>
          </div>
          <PrimaryButton onClick={onClose} className='px-20'>
            Close
          </PrimaryButton>
        </div>
      </Card>
    </Modal>
  );
};

export default NetworkIssueModal;
