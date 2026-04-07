import collegeBuildingImg from '@/assets/college-building.jpg';
import { Badge } from '@/components/ui/badge';
import { MapPin, Award, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const CollegeHero = () => (
  <section className="relative h-[75vh] min-h-[520px] overflow-hidden">
    <motion.img
      src={collegeBuildingImg}
      alt="Techno International New Town Campus"
      className="absolute inset-0 h-full w-full object-cover"
      initial={{ scale: 1.08 }}
      animate={{ scale: 1 }}
      transition={{ duration: 1.5, ease: 'easeOut' }}
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />

    {/* Floating glass accents */}
    <div className="absolute top-10 right-10 h-32 w-32 rounded-full bg-white/5 backdrop-blur-md border border-white/10 animate-pulse" />
    <div className="absolute bottom-32 left-8 h-20 w-20 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 animate-pulse" style={{ animationDelay: '1s' }} />

    <div className="relative z-10 flex h-full flex-col items-center justify-end pb-16 text-center text-white">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <Badge className="mb-4 border border-white/20 bg-white/10 backdrop-blur-lg text-white text-sm px-4 py-1.5 shadow-lg">
          <Award className="mr-1.5 h-4 w-4" /> NAAC B++ Accredited
        </Badge>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl drop-shadow-lg"
      >
        Techno International<br />New Town
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="mt-2 text-lg text-white/80 font-medium"
      >
        (Formerly Techno India College of Technology)
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="mt-5 flex flex-wrap justify-center gap-3"
      >
        {[
          { icon: MapPin, text: 'New Town, Kolkata, West Bengal' },
          { icon: Calendar, text: 'Established 2005' },
        ].map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 backdrop-blur-lg px-4 py-1.5 text-sm text-white/90 shadow-sm"
          >
            <item.icon className="h-3.5 w-3.5" /> {item.text}
          </span>
        ))}
        <span className="flex items-center rounded-full border border-white/15 bg-white/10 backdrop-blur-lg px-4 py-1.5 text-sm text-white/90 shadow-sm">
          Affiliated to MAKAUT &amp; Approved by AICTE
        </span>
      </motion.div>
    </div>
  </section>
);

export default CollegeHero;
