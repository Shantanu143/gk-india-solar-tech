import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight, CheckCircle2, Clock, Mail, MapPin, Phone } from "lucide-react";
import { useForm } from "react-hook-form";
import { Container } from "@/components/layout/Container";
import { Logo } from "@/components/layout/Logo";
import { Seo } from "@/components/layout/Seo";
import { SolarScene } from "@/components/marketing/illustrations/SolarScene";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Reveal } from "@/components/ui/Reveal";
import { Textarea } from "@/components/ui/Textarea";
import { COMPANY_EMAIL, COMPANY_PHONE_NUMBERS } from "@/config/contact";
import { contactFormSchema, type ContactFormValues } from "@/schemas/contact.schema";
import { submitContactInquiry } from "@/services/leadService";

const MAP_EMBED_SRC = "https://www.google.com/maps?q=Pune,+Maharashtra,+India&output=embed";

export function Contact() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ContactFormValues>({ resolver: zodResolver(contactFormSchema) });

  const mutation = useMutation({ mutationFn: submitContactInquiry });
  const messageLength = watch("message")?.length ?? 0;

  const onSubmit = handleSubmit((values) => mutation.mutate(values));

  return (
    <>
      <Seo
        title="Contact Us | GK India SolarTech"
        description="Get in touch with GK India SolarTech for residential, commercial or industrial solar enquiries."
        path="/contact"
      />

      {/* Hero: gradient backdrop behind a floating split card */}
      <section className="relative overflow-hidden bg-navy py-14 sm:py-20">
        <div aria-hidden="true" className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-orange/25 blur-3xl" />
        <div aria-hidden="true" className="absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-navy-light/50 blur-3xl" />

        <Container className="relative">
          <Reveal>
            <div className="grid grid-cols-1 overflow-hidden rounded-[2rem] bg-surface shadow-soft-lg lg:grid-cols-[1fr_1.15fr]">
              {/* Visual side — hidden below lg, where the form takes the full card width */}
              <div className="relative hidden overflow-hidden bg-navy-dark lg:flex lg:flex-col lg:justify-between lg:p-10">
                <div aria-hidden="true" className="absolute inset-0">
                  <SolarScene variant="commercial" className="h-full w-full object-cover opacity-90" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-navy-dark/60 to-navy-dark/10" />
                </div>

                <span className="relative z-10 text-xs font-bold tracking-[0.18em] text-orange uppercase">Get In Touch</span>

                <div className="relative z-10 flex flex-col gap-3">
                  <h2 className="text-2xl font-bold text-white xl:text-3xl">
                    Let&rsquo;s Talk <span className="text-orange">Solar</span>.
                  </h2>
                  <p className="max-w-xs text-sm text-white/70">
                    Reach out with your details and our team will follow up to discuss your project.
                  </p>

                  <div className="mt-3 flex flex-col gap-2.5">
                    {COMPANY_PHONE_NUMBERS.map((phone) => (
                      <a
                        key={phone.href}
                        href={phone.href}
                        className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm font-semibold text-white/90 backdrop-blur-sm transition-colors hover:bg-white/10"
                      >
                        <Phone className="h-4 w-4 shrink-0 text-orange" aria-hidden="true" />
                        {phone.display}
                      </a>
                    ))}
                    <a
                      href={`mailto:${COMPANY_EMAIL}`}
                      className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm font-semibold text-white/90 backdrop-blur-sm transition-colors hover:bg-white/10"
                    >
                      <Mail className="h-4 w-4 shrink-0 text-orange" aria-hidden="true" />
                      {COMPANY_EMAIL}
                    </a>
                    <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm font-semibold text-white/90 backdrop-blur-sm">
                      <MapPin className="h-4 w-4 shrink-0 text-orange" aria-hidden="true" />
                      Pune, Maharashtra, India
                    </div>
                  </div>
                </div>
              </div>

              {/* Form side */}
              <div className="p-6 sm:p-10 xl:p-12">
                <Logo />

                {mutation.isSuccess ? (
                  <div className="flex min-h-[420px] flex-col items-center justify-center gap-3 py-10 text-center">
                    <CheckCircle2 className="h-12 w-12 text-green" aria-hidden="true" />
                    <p className="text-lg font-bold text-navy">Thank you — your message has been sent.</p>
                    <p className="max-w-xs text-sm text-muted-foreground">Our team will get back to you shortly.</p>
                  </div>
                ) : (
                  <>
                    <h1 className="mt-6 text-3xl font-extrabold text-navy sm:text-4xl">Let&rsquo;s Get In Touch.</h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Or just reach out manually to{" "}
                      <a href={`mailto:${COMPANY_EMAIL}`} className="font-semibold text-orange hover:underline">
                        {COMPANY_EMAIL}
                      </a>
                      .
                    </p>

                    <form onSubmit={onSubmit} noValidate className="mt-7 flex flex-col gap-4">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            placeholder="Enter your first name…"
                            invalid={!!errors.firstName}
                            {...register("firstName")}
                          />
                          {errors.firstName && <p className="mt-1.5 text-xs text-error">{errors.firstName.message}</p>}
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            placeholder="Enter your last name…"
                            invalid={!!errors.lastName}
                            {...register("lastName")}
                          />
                          {errors.lastName && <p className="mt-1.5 text-xs text-error">{errors.lastName.message}</p>}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email address…"
                          invalid={!!errors.email}
                          {...register("email")}
                        />
                        {errors.email && <p className="mt-1.5 text-xs text-error">{errors.email.message}</p>}
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="flex">
                          <span className="flex h-12 items-center rounded-l-lg border border-r-0 border-border bg-surface-muted px-3.5 text-sm font-semibold text-navy/70">
                            +91
                          </span>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="(000) 000-0000"
                            invalid={!!errors.phone}
                            className="rounded-l-none"
                            {...register("phone")}
                          />
                        </div>
                        {errors.phone && <p className="mt-1.5 text-xs text-error">{errors.phone.message}</p>}
                      </div>

                      <div>
                        <Label htmlFor="message">Message</Label>
                        <div className="relative">
                          <Textarea
                            id="message"
                            rows={4}
                            maxLength={300}
                            placeholder="Enter your main text here…"
                            invalid={!!errors.message}
                            {...register("message")}
                          />
                          <span className="pointer-events-none absolute right-3 bottom-2.5 text-xs text-muted-foreground">
                            {messageLength}/300
                          </span>
                        </div>
                        {errors.message && <p className="mt-1.5 text-xs text-error">{errors.message.message}</p>}
                      </div>

                      {mutation.isError && <p className="text-sm text-error">Something went wrong. Please try again.</p>}

                      <Button type="submit" size="lg" disabled={mutation.isPending} className="mt-1 w-full gap-2">
                        {mutation.isPending ? "Sending…" : "Submit Form"}
                        {!mutation.isPending && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
                      </Button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Map + quick contact details */}
      <section className="py-16 sm:py-20">
        <Container>
          <Reveal className="grid grid-cols-1 gap-6 lg:grid-cols-[0.85fr_1.4fr]">
            <div className="flex flex-col gap-4">
              <div>
                <span className="text-xs font-bold tracking-[0.14em] text-orange uppercase">Find Us</span>
                <h2 className="mt-2 text-2xl font-bold text-navy">Our Service Area</h2>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-border bg-surface p-4">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-orange" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-navy">Pune, Maharashtra, India</p>
                  <p className="text-xs text-muted-foreground">Serving residential, commercial and industrial projects.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-border bg-surface p-4">
                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-orange" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-navy">Mon – Sat, 9:00 AM – 6:00 PM</p>
                  <p className="text-xs text-muted-foreground">Sundays by appointment.</p>
                </div>
              </div>
              {COMPANY_PHONE_NUMBERS.map((phone) => (
                <a
                  key={phone.href}
                  href={phone.href}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4 text-sm font-semibold text-navy transition-colors hover:border-orange/40 hover:text-orange"
                >
                  <Phone className="h-5 w-5 shrink-0 text-orange" aria-hidden="true" />
                  {phone.display}
                </a>
              ))}
            </div>

            <div className="min-h-[360px] overflow-hidden rounded-2xl border border-border shadow-soft">
              <iframe
                src={MAP_EMBED_SRC}
                title="GK India SolarTech service area — Pune, Maharashtra"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full min-h-[360px] w-full border-0"
              />
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
