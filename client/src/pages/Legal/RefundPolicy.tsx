import { LegalPageLayout } from "@/components/marketing/LegalPageLayout";
import { Seo } from "@/components/layout/Seo";
import { COMPANY_EMAIL } from "@/config/contact";

export function RefundPolicy() {
  return (
    <>
      <Seo
        title="Refund Policy | GK India SolarTech"
        description="Refund policy for services and payments made to GK India SolarTech."
        path="/refund-policy"
      />
      <LegalPageLayout title="Refund Policy" intro="Effective date: [Effective Date]">
        <section>
          <h2>Estimates & Enquiries</h2>
          <p>
            Requesting a free solar estimate or submitting an enquiry through this website does
            not involve any payment, and this policy does not apply to those actions.
          </p>
        </section>
        <section>
          <h2>Project Payments</h2>
          <p>
            Refund terms for any advance or milestone payment made as part of a solar installation
            project will be set out in your project proposal and agreement with GK India
            SolarTech.
          </p>
        </section>
        <section>
          <h2>Contact Us</h2>
          <p>
            For questions about refunds, contact us at{" "}
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
