import { Badge } from '@/components/ui/badge';

const recruiters = [
  'TCS', 'Capgemini', 'Wipro', 'Intel', 'Microsoft', 'SAP', 'Cognizant', 'Infosys',
  'Accenture', 'Amazon', 'IBM', 'Mindtree', 'L&T Infotech', 'Persistent Systems',
  'Mphasis', 'Atos', 'Cummins', 'Hettich', 'Johnson Controls', 'Saint-Gobain',
  'ADP', 'Zycus', 'Amdocs', 'Simplex', 'The Linde Group', 'Asahi India Glass',
];

const CollegeRecruiters = () => (
  <section className="py-16 bg-background">
    <div className="container max-w-5xl text-center">
      <h2 className="text-3xl font-extrabold text-foreground">Our Recruiters</h2>
      <p className="mt-2 text-muted-foreground mb-8">Top MNCs and industry leaders trust TINT talent</p>
      <div className="flex flex-wrap justify-center gap-3">
        {recruiters.map(r => (
          <Badge key={r} variant="outline" className="px-4 py-2 text-sm font-medium hover:bg-primary/5 hover:border-primary/30 transition-colors">
            {r}
          </Badge>
        ))}
      </div>
    </div>
  </section>
);

export default CollegeRecruiters;
