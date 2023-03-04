import { UilTimes } from "@iconscout/react-unicons";
import { useTranslation } from "next-i18next";

import PrimaryButton from "../catalog/PrimaryButton";
import Card from "../catalog/Card";
import Modal from "./Modal";
import MetaMaskErrorLogo from "public/svgs/metamask.svg";
import { SetStateAction, Dispatch } from "react";

interface InstallMetamaskProps {
  close: Dispatch<SetStateAction<boolean>>;
}
function InstallMetaMask({ close }: InstallMetamaskProps) {
  const { t } = useTranslation();

  let error;
  let installLink;
  let isMobile = false;
  const userAgent = window.navigator.userAgent;

  //@ts-ignore
  if (/Android/i.test(userAgent) && !window.ethereum) {
    isMobile = true;
    installLink = "https://play.google.com/store/apps/details?id=io.metamask";
  } else if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    isMobile = true;
    installLink = "https://apps.apple.com/us/app/metamask-blockchain-wallet/id1438144202";
  } else if (userAgent.match(/chrome|chromium|crios/i)) {
    installLink =
      "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn";
  } else if (userAgent.match(/firefox|fxios/i)) {
    installLink = "https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/";
  } else if (userAgent.match(/edg/i)) {
    installLink =
      "https://microsoftedge.microsoft.com/addons/detail/metamask/ejbalbakoplchlghecdalmeeeajnimhm?hl=en-US";
  } else {
    error = t("metamaskInstructions.browserNotCompatible");
  }

  return (
    <Modal open onClose={() => null}>
      <Card
        dialog
        onExitIconClick={() => {
          close(false);
        }}
        ExitIcon={UilTimes}>
        <div className='flex flex-col items-center mt-8'>
          <MetaMaskErrorLogo />
          {error ? (
            <span className='mt-3 mb-6 text-2xl font-semibold text-center'>{error}</span>
          ) : (
            <>
              <span className='mt-3 text-2xl font-semibold'>{t("others.uhoh")}</span>
              {!isMobile ? (
                <>
                  <span className='mt-4 text-center text-gray-400'>
                    {t("metamaskInstructions.MMExtensionNotPresent")}
                  </span>
                  <span className='text-center text-gray-400'>
                    {t("metamaskInstructions.setupMM")}
                  </span>
                </>
              ) : (
                <>
                  <span className='mt-4 text-center text-gray-400'>
                    {t("metamaskInstructions.pleaseInstallMMAndroid")}
                  </span>
                </>
              )}

              <a rel='noreferrer nofollow' target='_blank' href={installLink}>
                <PrimaryButton className='mb-12 mt-9'>{t("buttons.installMM")}</PrimaryButton>
              </a>
            </>
          )}
        </div>
      </Card>
    </Modal>
  );
}

export default InstallMetaMask;
