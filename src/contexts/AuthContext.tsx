import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { buildAppUrl } from '@/lib/app-url';

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

const normalizeRole = (role: unknown): 'student' | 'alumni' | 'staff' | 'admin' => {
  if (role === 'alumni' || role === 'staff' || role === 'admin') {
    return role;
  }

  return 'student';
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (authUser: User) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', authUser.id).maybeSingle();

    if (data) {
      setProfile(data);
      return;
    }

    const role = normalizeRole(authUser.user_metadata?.role);
    const { data: createdProfile } = await supabase
      .from('profiles')
      .insert({
        id: authUser.id,
        email: authUser.email ?? null,
        role,
        is_verified: role === 'student',
      })
      .select('*')
      .single();

    setProfile(createdProfile ?? null);
  };

  const refreshProfile = async () => {
    if (user) await fetchProfile(user);
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      if (nextSession?.user) {
        setTimeout(() => fetchProfile(nextSession.user), 0);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      if (currentSession?.user) {
        fetchProfile(currentSession.user);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, role: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: buildAppUrl('auth'),
        data: { role },
      },
    });

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
