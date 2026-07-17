import React, { createContext, useContext } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

type User = {
  id: string;
  name: string;
  email: string;
  freeCheatsheetsRemaining: number;
} | null;

type AuthContextType = {
  user: User;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

import { useSession } from '@/lib/auth-client';
import { authClient } from '@/lib/auth-client';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data, isPending, refetch } = useSession();

  const { data: profileData, refetch: refetchProfile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/profile`, {
        // @ts-ignore
        headers: {
          'Authorization': `Bearer ${data?.session?.token || ''}`
        },
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to fetch profile');
      const json = await res.json();
      return json.profile;
    },
    enabled: !!data?.user,
  });

  const user = data?.user ? {
    id: data.user.id,
    name: data.user.name,
    email: data.user.email,
    freeCheatsheetsRemaining: profileData?.freeCheatsheetsRemaining ?? 5,
  } : null;

  const refreshUser = async () => {
    await refetch();
    if (data?.user) {
      await refetchProfile();
    }
  };

  const logout = async () => {
    await authClient.signOut();
  };

  return (
    <AuthContext.Provider value={{ user: user ?? null, isLoading: isPending, refreshUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
