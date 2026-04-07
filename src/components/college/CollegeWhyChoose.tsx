import { Shield, BookOpen, Rocket, Users, Award, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const reasons = [
  { icon: Award, title: 'NAAC B++ Accredited', desc: 'Nationally recognized quality standards in education and infrastructure.' },
  { icon: Rocket, title: '₹32 LPA Highest Package', desc: 'Industry-leading placement offers from top MNCs like Amazon, Microsoft, and Intel.' },
  { icon: Users, title: '665+ Faculty & Staff', desc: 'Experienced professors with strong academic and industry backgrounds.' },
  { icon: BookOpen, title: '15+ Programs', desc: 'Wide range of B.Tech, M.Tech, MCA, and MBA programs with modern specializations.' },
  { icon: Globe, title: 'Part of Techno India Group', desc: 'One of India\'s largest knowledge management groups with a proven track record.' },
  { icon: Shield, title: '20+ Years of Trust', desc: 'Shaping careers since 2005 with consistent placements and academic excellence.' },
];

const CollegeWhyChoose = () => (
  <section className="py-16 border-y relative overflow-hidden">
    {/* Subtle gradient background */}
    <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-primary/5" />
    
    <div className="container max-w-5xl relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-10"
      >
        <h2 className="text-3xl font-extrabold text-foreground">Why Choose TINT?</h2>
        <p className="mt-2 text-muted-foreground">The smart choice for engineering excellence in Kolkata</p>
      </motion.div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {reasons.map((r, i) => (
          <motion.div
            key={r.title}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="group rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-6 hover:bg-card/90 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 hover:border-primary/20"
          >
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
              <r.icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-bold text-foreground">{r.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{r.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default CollegeWhyChoose;
