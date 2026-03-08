import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GraduationCap, Users, Briefcase, ArrowRight } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="container flex items-center justify-between py-4">
        <div className="flex items-center gap-2 font-bold text-xl text-primary">
          <GraduationCap className="h-7 w-7" />
          Campus Connect
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" asChild>
            <Link to="/auth?mode=login">Log In</Link>
          </Button>
          <Button asChild>
            <Link to="/auth?mode=signup">Sign Up</Link>
          </Button>
        </div>
      </header>

      <main className="container">
        <section className="flex flex-col items-center justify-center py-24 text-center">
          <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Connect with your
            <span className="text-primary"> campus community</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            Network with students and alumni. Discover internship opportunities, share updates, and build your professional circle — all in one place.
          </p>
          <div className="mt-10 flex gap-4">
            <Button size="lg" asChild>
              <Link to="/auth?mode=signup">
                Get Started <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/auth?mode=login">Log In</Link>
            </Button>
          </div>
        </section>

        <section className="grid gap-8 pb-24 sm:grid-cols-3">
          {[
            { icon: Users, title: 'Build Your Network', desc: 'Follow peers, discover talent, and grow your campus connections.' },
            { icon: Briefcase, title: 'Find Opportunities', desc: 'Alumni post internships and jobs. Stay ahead of the curve.' },
            { icon: GraduationCap, title: 'Showcase Your Profile', desc: 'Highlight your skills, projects, and availability to recruiters.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-xl border bg-card p-6 text-center shadow-sm animate-fade-in">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default Landing;
