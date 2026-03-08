import campusLibrary from '@/assets/campus-library.jpg';
import campusLab from '@/assets/campus-lab.jpg';
import campusPlacement from '@/assets/campus-placement.jpg';

const images = [
  { src: campusLibrary, label: 'Central Library', desc: 'Well-stocked library with digital resources' },
  { src: campusLab, label: 'Computer Labs', desc: 'State-of-the-art labs with modern equipment' },
  { src: campusPlacement, label: 'Placement Drives', desc: 'Regular campus recruitment events' },
];

const CollegeCampus = () => (
  <section className="py-16 bg-card border-y">
    <div className="container max-w-5xl">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-foreground">Life at TINT</h2>
        <p className="mt-2 text-muted-foreground">Experience world-class infrastructure and vibrant campus life</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-3">
        {images.map(img => (
          <div key={img.label} className="group overflow-hidden rounded-2xl">
            <div className="relative overflow-hidden aspect-[4/3]">
              <img src={img.src} alt={img.label} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4 text-white">
                <h3 className="font-bold text-lg">{img.label}</h3>
                <p className="text-xs text-white/80">{img.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default CollegeCampus;
