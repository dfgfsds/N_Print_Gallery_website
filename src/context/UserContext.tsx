"use client";
import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserAPi } from "@/api-endpoints/authendication";

interface UserContextType {
  user: any;
  isAuthenticated: boolean;
   setUser: (user: any) => void; 
  isLoading: boolean;
  error: any;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    setUserId(storedUserId);
  }, []);

  const { data, isLoading, error } = useQuery({
    queryKey: ["gerUserData", userId],
    queryFn: () => getUserAPi(`${userId}`),
    enabled: !!userId
  });

  useEffect(() => {
    if (data) {
      setUser(data);
    }
  }, [data]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser, // ⬅ pass setUser
        isAuthenticated: !!data,
        isLoading,
        error,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
