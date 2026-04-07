import campusLibrary from '@/assets/campus-library.jpg';
import campusLab from '@/assets/campus-lab.jpg';
import campusPlacement from '@/assets/campus-placement.jpg';
import { motion } from 'framer-motion';

const images = [
  { src: campusLibrary, label: 'Central Library', desc: 'Well-stocked library with digital resources' },
  { src: campusLab, label: 'Computer Labs', desc: 'State-of-the-art labs with modern equipment' },
  { src: campusPlacement, label: 'Placement Drives', desc: 'Regular campus recruitment events' },
];

const CollegeCampus = () => (
  <section className="py-16 border-y relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-primary/3 to-transparent" />

    <div className="container max-w-5xl relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-10"
      >
        <h2 className="text-3xl font-extrabold text-foreground">Life at TINT</h2>
        <p className="mt-2 text-muted-foreground">Experience world-class infrastructure and vibrant campus life</p>
      </motion.div>

      <div className="grid gap-6 sm:grid-cols-3">
        {images.map((img, i) => (
          <motion.div
            key={img.label}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.5 }}
            className="group overflow-hidden rounded-2xl border border-border/40 shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <div className="relative overflow-hidden aspect-[4/3]">
              <img src={img.src} alt={img.label} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              {/* Glassmorphism label */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="rounded-xl border border-white/20 bg-white/10 backdrop-blur-xl px-4 py-3 shadow-lg">
                  <h3 className="font-bold text-white text-lg">{img.label}</h3>
                  <p className="text-xs text-white/80">{img.desc}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default CollegeCampus;
