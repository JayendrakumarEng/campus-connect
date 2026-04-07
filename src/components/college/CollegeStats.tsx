import { TrendingUp, Users, Building2, Briefcase, GraduationCap, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

const stats = [
  { icon: Trophy, label: 'Highest Package', value: '₹32 LPA', sub: '2025' },
  { icon: TrendingUp, label: 'Avg Package (CSE)', value: '₹5 LPA', sub: '2024' },
  { icon: Users, label: 'Students Placed', value: '312+', sub: '2024 Batch' },
  { icon: Briefcase, label: 'Placement Rate', value: '75%', sub: 'Consistent' },
  { icon: Building2, label: 'Recruiting Companies', value: '100+', sub: 'Top MNCs' },
  { icon: GraduationCap, label: 'Years of Excellence', value: '20+', sub: 'Since 2005' },
];

const CollegeStats = () => (
  <section className="relative border-b py-14 overflow-hidden">
    {/* Glass background */}
    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
    
    <div className="container relative grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08, duration: 0.5 }}
          className="group flex flex-col items-center text-center rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-5 hover:bg-card/90 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
        >
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
            <s.icon className="h-7 w-7 text-primary group-hover:scale-110 transition-transform duration-300" />
          </div>
          <span className="text-2xl font-extrabold text-foreground">{s.value}</span>
          <span className="mt-1 text-xs font-semibold text-foreground">{s.label}</span>
          <span className="text-xs text-muted-foreground">{s.sub}</span>
        </motion.div>
      ))}
    </div>
  </section>
);

export default CollegeStats;
