import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, Globe, GraduationCap, Users, Building2, BookOpen } from 'lucide-react';

const departments = [
  { name: 'Computer Science & Engineering (CSE)', hod: 'Department of CSE', programs: ['B.Tech CSE', 'B.Tech CSBS', 'B.Tech AIML', 'B.Tech CSE-IoT', 'B.Tech CSE-DS', 'B.Tech CSE-Cyber Security'] },
  { name: 'Electronics & Communication Engineering (ECE)', hod: 'Department of ECE', programs: ['B.Tech ECE'] },
  { name: 'Electrical Engineering (EE)', hod: 'Department of EE', programs: ['B.Tech EE', 'M.Tech EE'] },
  { name: 'Applied Electronics & Instrumentation Engineering (AEIE)', hod: 'Department of AEIE', programs: ['B.Tech AEIE'] },
  { name: 'Mechanical Engineering (ME)', hod: 'Department of ME', programs: ['B.Tech ME'] },
  { name: 'Civil Engineering (CE)', hod: 'Department of CE', programs: ['B.Tech CE'] },
  { name: 'Information Technology (IT)', hod: 'Department of IT', programs: ['B.Tech IT'] },
  { name: 'Master of Computer Application (MCA)', hod: 'Department of MCA', programs: ['MCA'] },
  { name: 'Master of Business Administration (MBA)', hod: 'Department of MBA', programs: ['MBA'] },
];

const recruiters = [
  'TCS', 'Capgemini', 'Wipro', 'Intel', 'Microsoft', 'SAP', 'Cognizant', 'Infosys',
  'Accenture', 'Amazon', 'IBM', 'Mindtree', 'L&T Infotech', 'Persistent Systems', 'Mphasis', 'Atos',
];

const College = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container max-w-4xl py-8 space-y-8">
        {/* Hero */}
        <div className="text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <GraduationCap className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Techno International New Town</h1>
          <p className="text-muted-foreground text-sm">(Formerly known as Techno India College of Technology)</p>
          <div className="flex flex-wrap justify-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> New Town, Kolkata, West Bengal</span>
            <span className="flex items-center gap-1"><Phone className="h-4 w-4" /> +91 9674112076</span>
            <span className="flex items-center gap-1">
              <Globe className="h-4 w-4" />
              <a href="https://tint.edu.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">tint.edu.in</a>
            </span>
          </div>
        </div>

        {/* About */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5" /> About TINT</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground leading-relaxed space-y-3">
            <p>Techno International New Town (TINT) is a prominent engineering college under the Techno India Group, established in 2005. Situated in the industrial township of New Town, Kolkata, TINT is affiliated to MAKAUT and approved by AICTE.</p>
            <p>The institution focuses on accelerating knowledge transfer and enriching teaching-learning, research, and social outreach with a group of renowned academicians and experienced industry professionals.</p>
            <p>TINT offers programs in B.Tech (ECE, AEIE, CSE, IT, CSBS, AIML, CSE-IoT, CSE-DS, CSE-Cyber Security, CE, ME, EE), M.Tech (EE), MBA, and MCA.</p>
          </CardContent>
        </Card>

        {/* Departments */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5" /> Departments
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {departments.map(dept => (
              <Card key={dept.name}>
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-sm text-foreground mb-2">{dept.name}</h3>
                  <div className="flex flex-wrap gap-1">
                    {dept.programs.map(p => (
                      <Badge key={p} variant="secondary" className="text-xs">{p}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recruiters */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" /> Top Recruiters</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {recruiters.map(r => (
                <Badge key={r} variant="outline" className="text-xs">{r}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default College;
