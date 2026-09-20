/** Central route path constants — import these instead of hardcoding path strings. */
export const ROUTES = {
  home: "/",
  solarEstimate: "/solar-estimate",
  solarEstimateSuccess: "/solar-estimate/success",
  residentialSolar: "/residential-solar",
  commercialSolar: "/commercial-solar",
  industrialSolar: "/industrial-solar",
  products: "/products",
  services: "/services",
  about: "/about",
  netMetering: "/net-metering",
  subsidy: "/subsidy",
  contact: "/contact",
  faq: "/faq",
  login: "/login",
  signup: "/signup",
  becomePartner: "/become-a-partner",
  partnerApply: "/become-a-partner/apply",
  partnerApplySuccess: "/become-a-partner/success",
  account: "/account",
  privacyPolicy: "/privacy-policy",
  terms: "/terms",
  refundPolicy: "/refund-policy",
} as const;

export const billUploadHref = `${ROUTES.solarEstimate}?mode=bill-upload`;
