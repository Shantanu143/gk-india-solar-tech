import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import { COMPANY_EMAIL, COMPANY_PHONE_NUMBERS } from "@/config/contact";
import { ROUTES } from "@/constant/routes";
import { footerLinkGroups, legalLinks } from "@/data/navigation";
import { Container } from "./Container";
import { Logo } from "./Logo";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy-dark text-white/70">
      <Container className="py-16">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-6">
          <div className="sm:col-span-2 lg:col-span-2">
            <Logo variant="light" showTagline />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/50">
              Residential, commercial and industrial solar EPC solutions — from estimate through
              installation, net metering and ongoing support.
            </p>
          </div>

          {footerLinkGroups.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold text-white">{group.title}</h3>
              <ul className="mt-4 flex flex-col gap-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link to={link.href} className="text-sm text-white/55 transition-colors hover:text-orange-light">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* TODO: replace bracketed placeholder with the real company address once supplied. */}
          <div>
            <h3 className="text-sm font-semibold text-white">Contact</h3>
            <ul className="mt-4 flex flex-col gap-3 text-sm text-white/55">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-orange-light" aria-hidden="true" />
                <span>[Company Address]</span>
              </li>
              {COMPANY_PHONE_NUMBERS.map((phone) => (
                <li key={phone.href} className="flex items-center gap-2">
                  <Phone className="h-4 w-4 shrink-0 text-orange-light" aria-hidden="true" />
                  <a href={phone.href} className="hover:text-orange-light">
                    {phone.display}
                  </a>
                </li>
              ))}
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-orange-light" aria-hidden="true" />
                <a href={`mailto:${COMPANY_EMAIL}`} className="hover:text-orange-light">
                  {COMPANY_EMAIL}
                </a>
              </li>
              <li>
                <Link to={ROUTES.contact} className="font-semibold text-orange-light hover:text-orange">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-8 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} GK India SolarTech. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {legalLinks.map((link) => (
              <Link key={link.href} to={link.href} className="hover:text-white/70">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
