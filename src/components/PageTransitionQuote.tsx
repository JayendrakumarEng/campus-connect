import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap } from 'lucide-react';

interface StaffThought {
  name: string;
  department: string;
  thought: string;
}

const staffThoughts: StaffThought[] = [
  { name: 'Prof. Rajesh Singh', department: 'Computer Science', thought: 'Code every day. Not to be perfect, but to be better than yesterday. The industry needs builders, not just learners.' },
  { name: 'Dr. Anita Sharma', department: 'Electronics & Communication', thought: 'Your degree opens the door, but your skills keep you in the room. Focus on hands-on projects alongside theory.' },
  { name: 'Prof. Manoj Kumar', department: 'Training & Placement', thought: 'We bring companies to campus, but you must bring preparation to the table. Start your placement prep from 2nd year.' },
  { name: 'Dr. Priya Banerjee', department: 'Information Technology', thought: 'Open source contributions speak louder than a 9.5 CGPA. Build your GitHub profile like your resume.' },
  { name: 'Prof. Sanjay Mukherjee', department: 'Mathematics', thought: 'DSA is not just a subject — it\'s the language of every tech interview. Master it, and doors will open.' },
  { name: 'Dr. Kavita Roy', department: 'Mechanical Engineering', thought: 'Engineering is not about the branch you choose, it\'s about the problems you solve. Think beyond your syllabus.' },
  { name: 'Prof. Debashis Ghosh', department: 'Computer Science', thought: 'At TINT, we don\'t just teach technology — we help you become the kind of engineer companies fight to hire.' },
  { name: 'Dr. Ritu Agarwal', department: 'Business Administration', thought: 'Soft skills are not optional. The student who communicates well always gets the offer over the one who only codes.' },
  { name: 'Prof. Amit Das', department: 'Electrical Engineering', thought: 'Internships are not about stipends. They\'re about learning what classrooms can\'t teach. Apply to as many as you can.' },
  { name: 'Dr. Sunita Chatterjee', department: 'Physics', thought: 'Critical thinking is the foundation of innovation. Question everything, experiment freely, and never fear failure.' },
  { name: 'Prof. Rakesh Verma', department: 'Civil Engineering', thought: 'The best students are not the toppers — they\'re the ones who never stop being curious about how things work.' },
  { name: 'Dr. SatyaBharata Maiti', department: 'Information Technology', thought: 'Coding is thinking made visible. Master the logic first, then the syntax follows. And never underestimate networking — your next opportunity is one connection away.' },
  { name: 'Dr. SatyaBharata Maiti', department: 'Information Technology', thought: 'Don\'t just learn to code — learn to solve problems. Every great developer started by asking "why" before "how."' },
  { name: 'Dr. SatyaBharata Maiti', department: 'Information Technology', thought: 'Your network is your net worth. Attend meetups, contribute to communities, and never eat lunch alone. Opportunities come through people.' },
  { name: 'Dr. SatyaBharata Maiti', department: 'Information Technology', thought: 'The best time to start building projects was yesterday. The second best time is now. Stop watching tutorials and start shipping code.' },
  { name: 'Dr. SatyaBharata Maiti', department: 'Information Technology', thought: 'In IT, the only constant is change. The student who adapts fastest wins. Learn one language deeply, then expand horizontally.' },
  { name: 'Dr. SatyaBharata Maiti', department: 'Information Technology', thought: 'Debugging is not just fixing errors — it\'s training your brain to think systematically. Embrace every bug as a lesson.' },
  { name: 'Dr. Meera Joshi', department: 'Chemistry', thought: 'Your college years are the best time to take risks. Start a project, join a club, enter competitions. Regret nothing.' },
];

let lastIndex = -1;
let transitionCount = 0;
const sbmQuotes = staffThoughts.filter(s => s.name.includes('SatyaBharata'));
let lastSbmIndex = -1;

const getRandomThought = (): StaffThought => {
  transitionCount++;
  if (transitionCount % 3 === 0 && sbmQuotes.length > 0) {
    let idx: number;
    do { idx = Math.floor(Math.random() * sbmQuotes.length); } while (idx === lastSbmIndex && sbmQuotes.length > 1);
    lastSbmIndex = idx;
    const chosen = sbmQuotes[idx];
    lastIndex = staffThoughts.indexOf(chosen);
    return chosen;
  }
  const sbmIndices = new Set(sbmQuotes.map(q => staffThoughts.indexOf(q)));
  let idx: number;
  do { idx = Math.floor(Math.random() * staffThoughts.length); } while ((idx === lastIndex || sbmIndices.has(idx)) && staffThoughts.length > 2);
  lastIndex = idx;
  return staffThoughts[idx];
};

const PageTransitionQuote = () => {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [thought, setThought] = useState<StaffThought>(getRandomThought());
  const [prevPath, setPrevPath] = useState(location.pathname);

  const transitionPages = ['/feed', '/explore', '/bookmarks', '/success-stories', '/college', '/messages'];

  const shouldShowTransition = useCallback((from: string, to: string) => {
    return from !== to && transitionPages.includes(from) && transitionPages.includes(to);
  }, []);

  useEffect(() => {
    if (shouldShowTransition(prevPath, location.pathname)) {
      setThought(getRandomThought());
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 1800);
      return () => clearTimeout(timer);
    }
    setPrevPath(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    if (!visible) setPrevPath(location.pathname);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/98 backdrop-blur-xl"
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.96 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-md px-8 text-center"
          >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10"
            >
              <GraduationCap className="h-6 w-6 text-primary" />
            </motion.div>

            {/* Quote */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="text-lg font-medium text-foreground leading-relaxed"
            >
              "{thought.thought}"
            </motion.p>

            {/* Author */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="mt-5 flex flex-col items-center gap-1.5"
            >
              <p className="text-sm font-semibold text-foreground">{thought.name}</p>
              <span className="inline-block rounded-full bg-primary/10 px-3 py-0.5 text-xs font-medium text-primary">
                {thought.department}
              </span>
            </motion.div>

            {/* Loading bar */}
            <motion.div className="mx-auto mt-6 h-0.5 w-16 overflow-hidden rounded-full bg-border">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.6, ease: 'linear' }}
                className="h-full bg-primary/40 rounded-full"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PageTransitionQuote;
