import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Cpu, Zap, Radio, Cog, HardHat, Monitor, Briefcase, Binary } from 'lucide-react';

const departments = [
  { name: 'Computer Science & Engineering', icon: Cpu, programs: ['B.Tech CSE', 'CSBS', 'AIML', 'CSE-IoT', 'CSE-DS', 'CSE-Cyber Security'], highlight: true },
  { name: 'Information Technology', icon: Monitor, programs: ['B.Tech IT'], highlight: false },
  { name: 'Electronics & Communication', icon: Radio, programs: ['B.Tech ECE'], highlight: false },
  { name: 'Electrical Engineering', icon: Zap, programs: ['B.Tech EE', 'M.Tech EE'], highlight: false },
  { name: 'Applied Electronics & Instrumentation', icon: Binary, programs: ['B.Tech AEIE'], highlight: false },
  { name: 'Mechanical Engineering', icon: Cog, programs: ['B.Tech ME'], highlight: false },
  { name: 'Civil Engineering', icon: HardHat, programs: ['B.Tech CE'], highlight: false },
  { name: 'Master of Computer Application', icon: BookOpen, programs: ['MCA'], highlight: false },
  { name: 'Master of Business Administration', icon: Briefcase, programs: ['MBA'], highlight: false },
];

const CollegeDepartments = () => (
  <section className="py-16 bg-background">
    <div className="container max-w-5xl">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-foreground">Our Departments</h2>
        <p className="mt-2 text-muted-foreground">9 departments offering 15+ programs across engineering and management</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {departments.map(d => (
          <Card key={d.name} className={`hover:shadow-lg transition-all hover:-translate-y-1 ${d.highlight ? 'border-primary/30 bg-primary/5' : ''}`}>
            <CardContent className="pt-6">
              <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-xl ${d.highlight ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                <d.icon className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-foreground text-sm leading-tight">{d.name}</h3>
              <div className="mt-3 flex flex-wrap gap-1">
                {d.programs.map(p => (
                  <Badge key={p} variant="secondary" className="text-xs">{p}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

export default CollegeDepartments;
