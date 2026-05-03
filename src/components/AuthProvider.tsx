'use client';

import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Profile } from '@/lib/types';
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
});

function buildFallbackProfile(user: User): Profile {
  const meta = user.user_metadata || {};
  return {
    id: user.id,
    email: user.email || '',
    full_name: meta.full_name || user.email?.split('@')[0] || 'User',
    role: meta.role || 'opd',
    nama_instansi: meta.nama_instansi || '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabaseRef = useRef(createClient());

  useEffect(() => {
    let mounted = true;
    const supabase = supabaseRef.current;

    // Safety timeout — never show loading for more than 5 seconds
    const timeout = setTimeout(() => {
      if (mounted && loading) {
        console.warn('Auth timeout — forcing load');
        setLoading(false);
      }
    }, 5000);

    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!mounted) return;

        if (session?.user) {
          setUser(session.user);

          // Try fetching profile with a 3-second timeout
          try {
            const profilePromise = supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            const timeoutPromise = new Promise((_, reject) =>
              setTimeout(() => reject(new Error('timeout')), 3000)
            );

            const { data, error } = await Promise.race([profilePromise, timeoutPromise]) as any;

            if (!error && data && mounted) {
              setProfile(data);
            } else if (mounted) {
              setProfile(buildFallbackProfile(session.user));
            }
          } catch {
            if (mounted) {
              setProfile(buildFallbackProfile(session.user));
            }
          }
        }
      } catch (err) {
        console.error('Auth init error:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted) return;

        if (session?.user) {
          setUser(session.user);
          setProfile(buildFallbackProfile(session.user));
          // Fetch real profile in background (non-blocking)
          supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
            .then(({ data, error }) => {
              if (!error && data && mounted) {
                setProfile(data);
              }
            });
        } else {
          setUser(null);
          setProfile(null);
        }
        if (mounted) setLoading(false);
      }
    );

    return () => {
      mounted = false;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabaseRef.current.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
