import { ROUTES } from "@/constant/routes";

export interface NavLink {
  label: string;
  href: string;
}

export interface MainNavLink extends NavLink {
  type: "link";
}

/** A hover/click dropdown of related links — keeps the top nav from becoming one long flat row. */
export interface NavDropdown {
  type: "dropdown";
  label: string;
  items: NavLink[];
}

export type MainNavEntry = MainNavLink | NavDropdown;

function link(label: string, href: string): MainNavLink {
  return { type: "link", label, href };
}

export const mainNavLinks: MainNavEntry[] = [
  link("Home", ROUTES.home),
  {
    type: "dropdown",
    label: "Solutions",
    items: [
      { label: "Residential", href: ROUTES.residentialSolar },
      { label: "Commercial", href: ROUTES.commercialSolar },
      { label: "Industrial", href: ROUTES.industrialSolar },
      { label: "Products", href: ROUTES.products },
    ],
  },
  link("Services", ROUTES.services),
  link("About", ROUTES.about),
  link("Contact", ROUTES.contact),
];

export interface FooterLinkGroup {
  title: string;
  links: NavLink[];
}

export const footerLinkGroups: FooterLinkGroup[] = [
  {
    title: "Company",
    links: [
      { label: "Home", href: ROUTES.home },
      { label: "About", href: ROUTES.about },
      { label: "Contact", href: ROUTES.contact },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "Residential Solar", href: ROUTES.residentialSolar },
      { label: "Commercial Solar", href: ROUTES.commercialSolar },
      { label: "Industrial Solar", href: ROUTES.industrialSolar },
      { label: "Products", href: ROUTES.products },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Services Overview", href: ROUTES.services },
      { label: "Net Metering", href: ROUTES.netMetering },
      { label: "Government Subsidy", href: ROUTES.subsidy },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "FAQ", href: ROUTES.faq },
      { label: "Free Solar Estimate", href: ROUTES.solarEstimate },
    ],
  },
];

export const legalLinks: NavLink[] = [
  { label: "Privacy Policy", href: ROUTES.privacyPolicy },
  { label: "Terms", href: ROUTES.terms },
  { label: "Refund Policy", href: ROUTES.refundPolicy },
];
