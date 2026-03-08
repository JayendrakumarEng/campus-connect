import { TrendingUp, Users, Building2, Briefcase, GraduationCap, Trophy } from 'lucide-react';

const stats = [
  { icon: Trophy, label: 'Highest Package', value: '₹32 LPA', sub: '2025' },
  { icon: TrendingUp, label: 'Avg Package (CSE)', value: '₹5 LPA', sub: '2024' },
  { icon: Users, label: 'Students Placed', value: '312+', sub: '2024 Batch' },
  { icon: Briefcase, label: 'Placement Rate', value: '75%', sub: 'Consistent' },
  { icon: Building2, label: 'Recruiting Companies', value: '100+', sub: 'Top MNCs' },
  { icon: GraduationCap, label: 'Years of Excellence', value: '20+', sub: 'Since 2005' },
];

const CollegeStats = () => (
  <section className="border-b bg-card py-12">
    <div className="container grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
      {stats.map(s => (
        <div key={s.label} className="flex flex-col items-center text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <s.icon className="h-7 w-7 text-primary" />
          </div>
          <span className="text-2xl font-extrabold text-foreground">{s.value}</span>
          <span className="mt-1 text-xs font-semibold text-foreground">{s.label}</span>
          <span className="text-xs text-muted-foreground">{s.sub}</span>
        </div>
      ))}
    </div>
  </section>
);

export default CollegeStats;
