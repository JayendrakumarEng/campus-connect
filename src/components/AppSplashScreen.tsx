import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';

const AppSplashScreen = ({ onFinish }: { onFinish: () => void }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 40);

    const timer = setTimeout(() => onFinish(), 2400);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [onFinish]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[hsl(211,55%,14%)] via-[hsl(211,55%,20%)] to-[hsl(211,55%,10%)]"
    >
      {/* Animated floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 100 + i * 40 }}
          animate={{
            opacity: [0, 0.3, 0],
            y: [100 + i * 40, -50],
          }}
          transition={{
            duration: 2.5 + i * 0.3,
            delay: i * 0.2,
            repeat: Infinity,
            ease: 'easeOut',
          }}
          className="absolute rounded-full bg-white/20 blur-sm"
          style={{
            width: 4 + i * 2,
            height: 4 + i * 2,
            left: `${15 + i * 14}%`,
          }}
        />
      ))}

      {/* Center card - no backdrop-blur for performance */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mx-4 flex flex-col items-center rounded-3xl border border-white/20 bg-white/10 px-10 py-10 shadow-2xl"
        style={{ maxWidth: 360 }}
      >
        {/* Pulsing icon */}
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, delay: 0.4, type: 'spring', stiffness: 200 }}
          className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/30 bg-white/15 shadow-lg"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <GraduationCap className="h-8 w-8 text-white" />
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-2xl font-bold text-white tracking-tight text-center"
          style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
        >
          Campus Connect
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-2 text-sm text-white/70 text-center"
        >
          Techno International New Town
        </motion.p>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: '100%' }}
          transition={{ delay: 0.9, duration: 0.3 }}
          className="mt-6 h-1 w-full overflow-hidden rounded-full bg-white/15"
        >
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-white/60 via-white/90 to-white/60"
            style={{ width: `${progress}%` }}
          />
        </motion.div>

        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.3 }}
          className="mt-3 text-xs text-white/50 tracking-widest uppercase"
        >
          Loading...
        </motion.span>
      </motion.div>
    </motion.div>
  );
};

export default AppSplashScreen;
