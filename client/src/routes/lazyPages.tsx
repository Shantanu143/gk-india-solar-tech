import { lazy } from "react";

export const AccountPage = lazy(() => import("@/pages/Account/AccountPage").then((m) => ({ default: m.AccountPage })));
export const About = lazy(() => import("@/pages/About/About").then((m) => ({ default: m.About })));
export const Commercial = lazy(() =>
  import("@/pages/Commercial/Commercial").then((m) => ({ default: m.Commercial })),
);
export const Contact = lazy(() => import("@/pages/Contact/Contact").then((m) => ({ default: m.Contact })));
export const FAQ = lazy(() => import("@/pages/FAQ/FAQ").then((m) => ({ default: m.FAQ })));
export const Industrial = lazy(() =>
  import("@/pages/Industrial/Industrial").then((m) => ({ default: m.Industrial })),
);
export const LoginPage = lazy(() => import("@/pages/Login/LoginPage").then((m) => ({ default: m.LoginPage })));
export const PrivacyPolicy = lazy(() =>
  import("@/pages/Legal/PrivacyPolicy").then((m) => ({ default: m.PrivacyPolicy })),
);
export const RefundPolicy = lazy(() =>
  import("@/pages/Legal/RefundPolicy").then((m) => ({ default: m.RefundPolicy })),
);
export const Terms = lazy(() => import("@/pages/Legal/Terms").then((m) => ({ default: m.Terms })));
export const NetMetering = lazy(() =>
  import("@/pages/NetMetering/NetMetering").then((m) => ({ default: m.NetMetering })),
);
export const NotFound = lazy(() => import("@/pages/NotFound/NotFound").then((m) => ({ default: m.NotFound })));
export const Products = lazy(() => import("@/pages/Products/Products").then((m) => ({ default: m.Products })));
export const Residential = lazy(() =>
  import("@/pages/Residential/Residential").then((m) => ({ default: m.Residential })),
);
export const Services = lazy(() => import("@/pages/Services/Services").then((m) => ({ default: m.Services })));
export const SignupPage = lazy(() => import("@/pages/Signup/SignupPage").then((m) => ({ default: m.SignupPage })));
export const SolarEstimate = lazy(() =>
  import("@/pages/SolarEstimate/SolarEstimatePage").then((m) => ({ default: m.SolarEstimatePage })),
);
export const SolarEstimateSuccess = lazy(() =>
  import("@/pages/SolarEstimateSuccess/SolarEstimateSuccessPage").then((m) => ({
    default: m.SolarEstimateSuccessPage,
  })),
);
export const Subsidy = lazy(() => import("@/pages/Subsidy/Subsidy").then((m) => ({ default: m.Subsidy })));
