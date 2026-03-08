import { Button } from '@/components/ui/button';
import { ExternalLink, Phone } from 'lucide-react';

const CollegeCTA = () => (
  <section className="py-20 bg-primary text-primary-foreground">
    <div className="container max-w-3xl text-center">
      <h2 className="text-3xl font-extrabold">Ready to Join TINT?</h2>
      <p className="mt-3 text-primary-foreground/80">Admissions are open for 2026. Take the first step towards a brilliant career.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Button size="lg" variant="secondary" className="font-semibold" asChild>
          <a href="https://tint.edu.in/tint-admission-enquiry-2026.html" target="_blank" rel="noopener noreferrer">
            Apply Now <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
        <Button size="lg" variant="outline" className="font-semibold border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
          <a href="tel:+919674112076">
            <Phone className="mr-2 h-4 w-4" /> +91 9674112076
          </a>
        </Button>
      </div>
      <p className="mt-6 text-xs text-primary-foreground/60">
        Visit: <a href="https://tint.edu.in" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary-foreground">tint.edu.in</a> · Action Area I, New Town, Kolkata – 700156
      </p>
    </div>
  </section>
);

export default CollegeCTA;
