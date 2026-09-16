import { LegalPageLayout } from "@/components/marketing/LegalPageLayout";
import { Seo } from "@/components/layout/Seo";
import { COMPANY_EMAIL } from "@/config/contact";

export function Terms() {
  return (
    <>
      <Seo
        title="Terms & Conditions | GK India SolarTech"
        description="Terms and conditions for using the GK India SolarTech website and services."
        path="/terms"
      />
      <LegalPageLayout title="Terms & Conditions" intro="Effective date: [Effective Date]">
        <section>
          <h2>Use of This Website</h2>
          <p>
            This website provides information about GK India SolarTech's residential, commercial
            and industrial solar solutions. Solar estimates and savings figures shown on this
            website are illustrative only and are not a binding quote or guarantee.
          </p>
        </section>
        <section>
          <h2>No Guaranteed Outcomes</h2>
          <p>
            Government subsidy eligibility, net-metering approval and financing outcomes depend on
            applicable scheme rules, utility processes and third-party approval, and are not
            guaranteed by GK India SolarTech.
          </p>
        </section>
        <section>
          <h2>Contact Us</h2>
          <p>
            For questions about these terms, contact us at{" "}
            <a href={`mailto:${COMPANY_EMAIL}`} className="text-navy underline">
              {COMPANY_EMAIL}
            </a>
            .
          </p>
        </section>
      </LegalPageLayout>
    </>
  );
}
