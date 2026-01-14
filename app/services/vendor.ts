import API from "./api";

export type VendorOnboardingStep2Payload = {
  contactFullName: string;
  contactJobTitle?: string;
  contactWorkEmail: string;
  contactIdDocumentUrl?: string;
  contactMobile: string;
  contactMobileCountryCode: string;
  termsAccepted: boolean;
};

export const submitOnboardingStep2 = (payload: VendorOnboardingStep2Payload) => {
  return API.post("/onboarding/step2", payload);
};
