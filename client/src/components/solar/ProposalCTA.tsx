import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { ROUTES } from "@/constant/routes";

interface ProposalCTAProps {
  onGetProposal: () => void;
}

export function ProposalCTA({ onGetProposal }: ProposalCTAProps) {
  return (
    <Reveal className="flex flex-col items-center rounded-2xl bg-navy-dark px-6 py-10 text-center sm:px-10">
      <h2 className="text-2xl font-bold text-white sm:text-3xl">Want A Detailed Solar Proposal?</h2>
      <p className="mt-3 max-w-md text-sm text-white/65 sm:text-base">
        Share your details and our solar expert can take the next step with you.
      </p>
      <div className="mt-7 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        <Button type="button" size="lg" onClick={onGetProposal}>
          Get Your Detailed Solar Proposal
        </Button>
        <Button asChild variant="outline-light" size="lg">
          <Link to={ROUTES.contact}>Talk To A Solar Expert</Link>
        </Button>
      </div>
    </Reveal>
  );
}
