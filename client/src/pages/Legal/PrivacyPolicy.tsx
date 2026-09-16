import { LegalPageLayout } from "@/components/marketing/LegalPageLayout";
import { Seo } from "@/components/layout/Seo";
import { COMPANY_EMAIL } from "@/config/contact";

export function PrivacyPolicy() {
  return (
    <>
      <Seo
        title="Privacy Policy | GK India SolarTech"
        description="How GK India SolarTech collects, uses and protects your information."
        path="/privacy-policy"
      />
      <LegalPageLayout title="Privacy Policy" intro="Effective date: [Effective Date]">
        <section>
          <h2>Information We Collect</h2>
          <p>
            When you request a solar estimate, upload an electricity bill, or contact us, we
            collect information such as your name, contact details, property details and
            electricity usage information that you choose to share with us.
          </p>
        </section>
        <section>
          <h2>How We Use Your Information</h2>
          <p>
            We use the information you provide to prepare solar estimates, respond to enquiries,
            assist with government subsidy and net-metering processes, and deliver our solar EPC
            services.
          </p>
        </section>
        <section>
          <h2>Data Sharing</h2>
          <p>
            We do not sell your personal information. Information may be shared with relevant
            government or utility bodies only where required to assist with subsidy or
            net-metering applications on your behalf.
          </p>
        </section>
        <section>
          <h2>Contact Us</h2>
          <p>
            For questions about this policy, contact us at{" "}
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
