import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GraduationCap, Users, Briefcase, ArrowRight, MessageSquare, Trophy, Sparkles, ChevronRight, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

const Landing = () => {
  const features = [
    { icon: Users, title: 'Build Your Network', desc: 'Follow peers, discover talent, and grow your campus connections with students and alumni.' },
    { icon: Briefcase, title: 'Find Opportunities', desc: 'Staff & alumni post internships, jobs, and challenges from top companies like Google, Amazon & TCS.' },
    { icon: GraduationCap, title: 'Showcase Your Profile', desc: 'Highlight skills, upload resume, add projects, and let recruiters find you.' },
    { icon: MessageSquare, title: 'Direct Messaging', desc: 'Chat privately with alumni, staff, and peers. Get mentorship and career guidance.' },
    { icon: Trophy, title: 'Success Stories', desc: 'Read real placement journeys from seniors. Learn tips that actually helped them crack interviews.' },
    { icon: Sparkles, title: 'Staff Dashboard', desc: 'Teachers post events, create polls, endorse students, and manage campus opportunities.' },
  ];

  const stats = [
    { value: '500+', label: 'Active Students' },
    { value: '150+', label: 'Alumni Network' },
    { value: '50+', label: 'Companies Hiring' },
    { value: '95%', label: 'Placement Rate' },
  ];

  const testimonials = [
    { name: 'Ananya Das', role: 'Placed at Microsoft', quote: 'Campus Connect helped me find the right opportunities and connect with alumni who guided my preparation.', branch: 'IT, 4th Year' },
    { name: 'Rahul Kumar', role: 'SDE at Google', quote: 'As an alumni, I love posting opportunities for my juniors. This platform bridges the gap perfectly.', branch: 'ECE, Alumni 2024' },
    { name: 'Priya Sharma', role: 'ML Intern at DeepTech AI', quote: 'The success stories section gave me confidence. Reading how others cracked it motivated me to keep going.', branch: 'CSE, 3rd Year' },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b bg-card/90 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            <GraduationCap className="h-7 w-7" />
            <span>Campus Connect</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link to="/auth?mode=login">Log In</Link>
            </Button>
            <Button asChild className="shadow-md">
              <Link to="/auth?mode=signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="container relative py-20 md:py-32">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="flex flex-col items-center text-center"
          >
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm text-muted-foreground shadow-sm mb-8">
              <Star className="h-3.5 w-3.5 text-warning fill-warning" />
              Trusted by 500+ students at TINT
            </motion.div>

            <motion.h1 variants={fadeUp} custom={1} className="max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1]">
              Your Campus,{' '}
              <span className="relative">
                <span className="text-primary">Your Network,</span>
              </span>
              <br />
              Your Future
            </motion.h1>

            <motion.p variants={fadeUp} custom={2} className="mt-6 max-w-2xl text-lg md:text-xl text-muted-foreground leading-relaxed">
              The all-in-one platform for TINT students and alumni. Discover internships, connect with mentors, share achievements, and build the career you deserve.
            </motion.p>

            <motion.div variants={fadeUp} custom={3} className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="text-base px-8 py-6 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-shadow">
                <Link to="/auth?mode=signup">
                  Join Campus Connect <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-base px-8 py-6">
                <Link to="/auth?mode=login">
                  I already have an account
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y bg-card/50">
        <div className="container py-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, i) => (
              <motion.div key={stat.label} variants={fadeUp} custom={i} className="text-center">
                <div className="text-3xl md:text-4xl font-extrabold text-primary">{stat.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-20 md:py-28">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={stagger}
          className="text-center mb-16"
        >
          <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Everything you need to <span className="text-primary">succeed</span>
          </motion.h2>
          <motion.p variants={fadeUp} custom={1} className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
            From finding opportunities to building your network — we've got you covered.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={stagger}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              variants={fadeUp}
              custom={i}
              className="group relative rounded-2xl border bg-card p-8 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300"
            >
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Testimonials */}
      <section className="border-y bg-card/50">
        <div className="container py-20 md:py-28">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Hear from our <span className="text-primary">community</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="mt-4 text-muted-foreground text-lg">
              Real stories from real students and alumni.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={stagger}
            className="grid gap-6 md:grid-cols-3"
          >
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                variants={fadeUp}
                custom={i}
                className="rounded-2xl border bg-card p-8 shadow-sm"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 text-warning fill-warning" />
                  ))}
                </div>
                <p className="text-foreground leading-relaxed italic">"{t.quote}"</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role} · {t.branch}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-20 md:py-28">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="relative rounded-3xl bg-primary px-8 py-16 md:px-16 md:py-20 text-center overflow-hidden"
        >
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-primary-foreground/10 blur-2xl" />
            <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-primary-foreground/10 blur-2xl" />
          </div>
          <motion.h2 variants={fadeUp} custom={0} className="relative text-3xl md:text-4xl font-extrabold text-primary-foreground">
            Ready to kickstart your career?
          </motion.h2>
          <motion.p variants={fadeUp} custom={1} className="relative mt-4 text-lg text-primary-foreground/80 max-w-xl mx-auto">
            Join hundreds of TINT students already using Campus Connect to find opportunities and build their future.
          </motion.p>
          <motion.div variants={fadeUp} custom={2} className="relative mt-8">
            <Button size="lg" variant="secondary" asChild className="text-base px-8 py-6 shadow-lg">
              <Link to="/auth?mode=signup">
                Create Free Account <ChevronRight className="ml-1 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/50">
        <div className="container py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <GraduationCap className="h-5 w-5 text-primary" />
            <span>© 2026 Campus Connect — Built for TINT students</span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link to="/auth?mode=login" className="hover:text-foreground transition-colors">Login</Link>
            <Link to="/auth?mode=signup" className="hover:text-foreground transition-colors">Sign Up</Link>
            <Link to="/college" className="hover:text-foreground transition-colors">About College</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
