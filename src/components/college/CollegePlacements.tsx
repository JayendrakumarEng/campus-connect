import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp } from 'lucide-react';

const branchData = [
  { branch: 'CSE', highest: '₹12 LPA', average: '₹5 LPA', lowest: '₹3.36 LPA', placed: 80 },
  { branch: 'IT', highest: '₹8 LPA', average: '₹4.60 LPA', lowest: '₹3.36 LPA', placed: 41 },
  { branch: 'ECE', highest: '₹8.47 LPA', average: '₹4.40 LPA', lowest: '₹1.80 LPA', placed: 62 },
  { branch: 'EE', highest: '₹8.17 LPA', average: '₹4.18 LPA', lowest: '₹1.80 LPA', placed: 46 },
  { branch: 'ME', highest: '₹8.17 LPA', average: '₹3.76 LPA', lowest: '₹1.80 LPA', placed: 26 },
  { branch: 'AEIE', highest: '₹4.50 LPA', average: '₹4.30 LPA', lowest: '₹1.80 LPA', placed: 22 },
  { branch: 'CE', highest: '₹8.17 LPA', average: '₹3.46 LPA', lowest: '₹1.80 LPA', placed: 15 },
  { branch: 'MCA', highest: '₹7.30 LPA', average: '₹4.20 LPA', lowest: '₹2.50 LPA', placed: 20 },
];

const CollegePlacements = () => (
  <section className="py-16 bg-card border-y">
    <div className="container max-w-5xl">
      <div className="text-center mb-10">
        <Badge className="mb-3 bg-primary/10 text-primary border border-primary/20 text-sm">
          <TrendingUp className="mr-1 h-4 w-4" /> Placement Report 2024
        </Badge>
        <h2 className="text-3xl font-extrabold text-foreground">Branch-Wise Placement Statistics</h2>
        <p className="mt-2 text-muted-foreground">312+ students placed across 100+ companies in 2024</p>
      </div>

      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-primary/5">
              <th className="px-4 py-3 text-left font-bold text-foreground">Branch</th>
              <th className="px-4 py-3 text-center font-bold text-foreground">Students Placed</th>
              <th className="px-4 py-3 text-center font-bold text-primary">Highest Package</th>
              <th className="px-4 py-3 text-center font-bold text-foreground">Average Package</th>
              <th className="px-4 py-3 text-center font-bold text-foreground">Lowest Package</th>
            </tr>
          </thead>
          <tbody>
            {branchData.map((row, i) => (
              <tr key={row.branch} className={i % 2 === 0 ? 'bg-background' : 'bg-muted/30'}>
                <td className="px-4 py-3 font-semibold text-foreground">{row.branch}</td>
                <td className="px-4 py-3 text-center text-foreground">{row.placed}</td>
                <td className="px-4 py-3 text-center font-bold text-primary">{row.highest}</td>
                <td className="px-4 py-3 text-center text-foreground">{row.average}</td>
                <td className="px-4 py-3 text-center text-muted-foreground">{row.lowest}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-black text-primary">₹32 LPA</div>
            <p className="text-sm font-semibold text-foreground mt-1">Highest Package Ever</p>
            <p className="text-xs text-muted-foreground">Season 2025</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-black text-foreground">512</div>
            <p className="text-sm font-semibold text-foreground mt-1">Total Job Offers</p>
            <p className="text-xs text-muted-foreground">Season 2023</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-black text-foreground">80%</div>
            <p className="text-sm font-semibold text-foreground mt-1">Peak Placement Rate</p>
            <p className="text-xs text-muted-foreground">Consistent across years</p>
          </CardContent>
        </Card>
      </div>
    </div>
  </section>
);

export default CollegePlacements;
