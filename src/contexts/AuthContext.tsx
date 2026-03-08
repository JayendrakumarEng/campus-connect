import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string | null;
  branch: string | null;
  year: string | null;
  company: string | null;
  bio: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  skills: string[] | null;
  status: string | null;
  avatar_url: string | null;
  is_verified: boolean | null;
  created_at: string | null;
  department: string | null;
  resume_url: string | null;
  portfolio_url: string | null;
  projects: any;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, role: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
    setProfile(data);
  };

  const refreshProfile = async () => {
    if (user) await fetchProfile(user.id);
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        // Use setTimeout to avoid Supabase deadlock
        setTimeout(() => fetchProfile(session.user.id), 0);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, role: string) => {
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { role },
      },
    });
    if (!error && data?.user) {
      // Update profile with role
      await supabase.from('profiles').update({
        role,
        is_verified: role === 'student',
      }).eq('id', data.user.id);

      // Insert into user_roles for RLS
      const appRole = role as 'student' | 'alumni' | 'staff' | 'admin';
      await supabase.from('user_roles').insert({
        user_id: data.user.id,
        role: appRole,
      });
    }
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, signUp, signIn, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
