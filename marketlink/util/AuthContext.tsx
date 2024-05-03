// src/contexts/AuthContext.tsx

import { createContext, useContext, ReactNode, useState, useEffect, Dispatch, SetStateAction } from 'react';

interface User {
    id: string;
    name: string;
    email: string;
    type: string; // Ejemplo: 'entrepreneur' o 'user'
}

interface AuthContextType {
    user: User | null;
    setUser: Dispatch<SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
            console.log("Loading user data from local storage:", storedUserData);
            setUser(JSON.parse(storedUserData));
        }
    }, [setUser]);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
