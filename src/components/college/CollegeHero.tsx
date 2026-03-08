import campusHero from '@/assets/campus-hero.jpg';
import { Badge } from '@/components/ui/badge';
import { MapPin, Award, Calendar } from 'lucide-react';

const CollegeHero = () => (
  <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
    <img src={campusHero} alt="Techno International New Town Campus" className="absolute inset-0 h-full w-full object-cover" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
    <div className="relative z-10 flex h-full flex-col items-center justify-end pb-16 text-center text-white">
      <Badge className="mb-4 bg-primary/90 text-primary-foreground text-sm px-4 py-1">
        <Award className="mr-1 h-4 w-4" /> NAAC B++ Accredited
      </Badge>
      <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl drop-shadow-lg">
        Techno International<br />New Town
      </h1>
      <p className="mt-2 text-lg text-white/80 font-medium">(Formerly Techno India College of Technology)</p>
      <div className="mt-5 flex flex-wrap justify-center gap-4 text-sm text-white/90">
        <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> New Town, Kolkata, West Bengal</span>
        <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> Established 2005</span>
        <span>Affiliated to MAKAUT &amp; Approved by AICTE</span>
      </div>
    </div>
  </section>
);

export default CollegeHero;
