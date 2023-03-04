import React, { useCallback, useEffect, useRef, useState } from "react";
import { UilUserCircle, UilEnvelope, UilArrowLeft } from "@iconscout/react-unicons";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { Breakpoints } from "src/constants/Breakpoints";
import { useViewport } from "src/hooks/useViewport";
import BottomSheetOptions from "../fund/BottomSheetOptions";
import Card from "../catalog/Card";
import Modal from "./Modal";
import Input from "../catalog/Input";
import PrimaryButton from "../catalog/PrimaryButton";
import ContentWrapper from "../wrappers/ContentWrapper";
import Regex from "src/constants/Regex";
import { get } from "src/services/axios";
import API from "src/constants/Apis";
import { ErrorCodes } from "src/constants/Errors";
import { useMetaversalAccount } from "src/contexts/useMetaversalAccount";
import { isProduction, validateCatIdInput } from "../../utils/misc";
import Separator from "../common/Separator";
import { Toast } from "src/utils/toast";

const hCAPTCHASiteKey = isProduction()
  ? "6ec12cd9-9946-481b-b16e-04333cf1d94f"
  : "4a557738-d4ec-49b1-8d7e-3af311e05d69";

const formatToLowerCase = (id: string) => id.trim().toLowerCase();

interface ConnectModalProps {
  goBack: () => void;
  isWalletModalOpen?: boolean;
}
function ConnectModalContent({ goBack }: ConnectModalProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { width } = useViewport();
  const { id } = router.query;

  const { createAccount } = useMetaversalAccount();

  const captchaRef = useRef<HCaptcha | null>(null);

  const [loading, setLoading] = useState(false);
  const [showEmail, setShowEmail] = useState(!id);
  const [email, setEmail] = useState("");
  const [catId, setCatId] = useState("");
  const [errors, setErrors] = useState({
    catId: "",
    email: "",
  });

  const checkIfEmailIsTaken = useCallback(
    async (inputEmail: string) => {
      const emailInfoResponse = await get(API.next.emailInfo, {
        params: { email: inputEmail },
      });
      if (!emailInfoResponse) {
        updateError({ email: "failed" });
        setShowEmail(true);
        setLoading(false);
        return;
      }
      const { valid, taken } = emailInfoResponse;
      if ((!valid || taken) && id) setShowEmail(true);

      if (!valid) updateError({ email: ErrorCodes.invalidEmail });
      else if (taken) updateError({ email: ErrorCodes.emailTaken });
      else updateError({ email: null });
    },
    [id]
  );

  const onEmailUpdate = useCallback(
    async (paramEmail: string) => {
      const inputEmail = formatToLowerCase(paramEmail);

      if (!inputEmail && !catId) return;
      else if (!catId) updateError({ catId: "accountCreation.enterCatId" });
      else if (!inputEmail) {
        updateError({ email: "accountCreation.enterEmail" });
        return;
      }

      setLoading(true);
      const validEmail = Regex.email.test(inputEmail);
      if (!validEmail) {
        updateError({ email: ErrorCodes.invalidEmail });
        if (id) setShowEmail(true);
      } else {
        await checkIfEmailIsTaken(inputEmail);
      }
      setLoading(false);
    },
    [catId, id, checkIfEmailIsTaken]
  );

  useEffect(() => {
    (async () => {
      if (id) {
        const decryptResponse = await get(API.next.decrypt, { params: { id } });
        if (!decryptResponse) return;

        await onEmailUpdate(decryptResponse.email);
        setEmail(decryptResponse.email);
      }
    })();
  }, [id, onEmailUpdate]);

  const updateError = (e: any) => setErrors((err) => ({ ...err, ...e }));

  const onCreateAccount = async (token: string) => {
    captchaRef.current?.resetCaptcha();
    if (!Object.values(errors).every((v) => v === null)) return;

    try {
      const success = await createAccount(formatToLowerCase(catId), email, token);
      if (success) router.replace("/welcome");
    } catch (error) {
      Toast.error(t(error.message));
    }
    setLoading(false);
  };

  async function handleHCAPTCHA(event: any) {
    event.preventDefault();
    setLoading(true);

    if (!Object.values(errors).every((v) => v === null)) return;
    captchaRef.current?.execute();
  }

  const onCatIdUpdated = async (_id: string) => {
    const catIdCopy = formatToLowerCase(_id);

    if (!catIdCopy) return;

    setLoading(true);
    const response = await get(API.next.catInfo, { params: { catId: catIdCopy } });
    setLoading(false);
    if (!response) {
      updateError({ catId: "failed" });
      return;
    }

    const { errorCode, valid, taken } = response;
    if (errorCode) updateError({ catId: errorCode });
    else if (taken) updateError({ catId: "errors:catId/alreadyTaken" });
    else if (!taken && valid) updateError({ catId: null });
  };

  let catRightLabel = "";
  if (!errors.catId && catId) catRightLabel = t("accountCreation.valid");

  let catRightLabelClassName = "";
  if (!errors.catId) catRightLabelClassName = "text-primary";

  const hCAPTCHA = (
    <HCaptcha
      ref={captchaRef}
      sitekey={hCAPTCHASiteKey}
      onVerify={onCreateAccount}
      size='invisible'
      theme='dark'
      onChalExpired={() => setLoading(false)}
      onError={() => setLoading(false)}
      onExpire={() => setLoading(false)}
      onClose={() => setLoading(false)}
    />
  );

  // passing () => null to onClose so it does not close on pressing outside the card
  return (
    <>
      {width > 0 && width >= Breakpoints.sm1 ? (
        <Card
          dialog
          responsiveOverride='bg-black-800 w-[470px]'
          onExitIconClick={goBack}
          ExitIcon={UilArrowLeft}>
          <Card.Title>{t("headings.connect")}</Card.Title>
          <Card.Description>{t("others.thereIsNoAccount")}</Card.Description>
          <Separator />
          <div className='flex flex-col'>
            <form className='flex flex-col gap-2' onSubmit={handleHCAPTCHA}>
              {hCAPTCHA}
              <ContentWrapper
                label={t("accountCreation.accountName")}
                rightLabel={catRightLabel}
                rightLabelClassName={catRightLabelClassName}
                overrideSmallScreenStyle>
                <Input
                  inputClassName='text-xl font-bold'
                  debouncedOnChangeInput={onCatIdUpdated}
                  value={catId}
                  onChangeText={setCatId}
                  validate={validateCatIdInput}
                  suffix='.cat'
                  Icon={UilUserCircle}
                  error={errors.catId}
                  overrideSmallScreenStyle
                />
              </ContentWrapper>
              {showEmail && (
                <ContentWrapper label={t("email")} overrideSmallScreenStyle>
                  <Input
                    inputClassName='text-xl font-bold'
                    Icon={UilEnvelope}
                    value={email}
                    onChangeText={setEmail}
                    debouncedOnChangeInput={onEmailUpdate}
                    error={errors.email}
                    overrideSmallScreenStyle
                  />
                </ContentWrapper>
              )}
              <PrimaryButton
                type='submit'
                loading={loading}
                disabled={
                  !Object.values(errors).every((v) => v === null) || !catId.length || !email.length
                }
                className='self-center mt-8 w-fit'>
                <span className='mx-4 text-lg font-bold tracking-wide'>
                  {t("buttons.createAccount")}
                </span>
              </PrimaryButton>
            </form>
          </div>
        </Card>
      ) : (
        <div>
          <BottomSheetOptions title={t("headings.connect")} open setOpen={goBack}>
            <hr className='my-2 border-black-800' />

            <Card.Description>{t("others.thereIsNoAccount")}</Card.Description>
            <Separator />
            <div className='flex flex-col'>
              <form className='flex flex-col gap-2' onSubmit={handleHCAPTCHA}>
                {hCAPTCHA}
                <ContentWrapper
                  overrideSmallScreenStyle
                  label={t("accountCreation.accountName")}
                  rightLabel={catRightLabel}
                  rightLabelClassName={catRightLabelClassName}>
                  <Input
                    inputClassName='text-xl font-bold'
                    debouncedOnChangeInput={onCatIdUpdated}
                    value={catId}
                    onChangeText={setCatId}
                    validate={validateCatIdInput}
                    suffix='.cat'
                    Icon={UilUserCircle}
                    error={errors.catId}
                    overrideSmallScreenStyle
                  />
                </ContentWrapper>
                {showEmail && (
                  <ContentWrapper overrideSmallScreenStyle label={t("email")}>
                    <Input
                      inputClassName='text-xl font-bold'
                      Icon={UilEnvelope}
                      value={email}
                      onChangeText={setEmail}
                      debouncedOnChangeInput={onEmailUpdate}
                      error={errors.email}
                      overrideSmallScreenStyle
                    />
                  </ContentWrapper>
                )}
                <div className='flex items-center justify-center mb-4'>
                  <PrimaryButton
                    type='submit'
                    loading={loading}
                    disabled={
                      !Object.values(errors).every((v) => v === null) ||
                      !catId.length ||
                      !email.length
                    }
                    className='self-center mt-8 w-fit'>
                    <span className='mx-4 text-lg font-bold tracking-wide'>
                      {t("buttons.createAccount")}
                    </span>
                  </PrimaryButton>
                </div>
              </form>
            </div>
          </BottomSheetOptions>
        </div>
      )}
    </>
  );
}

export default function ConnectModal({ goBack, isWalletModalOpen }: ConnectModalProps) {
  const { width } = useViewport();
  return (
    <>
      {width > 0 && width >= Breakpoints.sm1 ? (
        <div>
          {!isWalletModalOpen && (
            <Modal containerVPositionStyle='md:self-center' open onClose={() => null}>
              <ConnectModalContent goBack={goBack} />
            </Modal>
          )}
        </div>
      ) : (
        <div>{!isWalletModalOpen && <ConnectModalContent goBack={goBack} />}</div>
      )}
    </>
  );
}
