import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AltoContrastContextType {
    isHighContrast: boolean;
    toggleHighContrast: () => void;
}

const defaultState = {
    isHighContrast: false, // El estado inicial ahora se definirá basándose en localStorage
    toggleHighContrast: () => {}
};

const HighContrastContext = createContext<AltoContrastContextType>(defaultState);

export const useHighContrast = () => useContext(HighContrastContext);

interface Props {
    children: ReactNode;
}

export const HighContrastProvider: React.FC<Props> = ({ children }) => {
    const [isHighContrast, setIsHighContrast] = useState<boolean>(() => {
        // Intenta recuperar el estado de alto contraste desde localStorage al inicializar
        const stored = localStorage.getItem('highContrast');
        return stored === 'true' ? true : false; // Si no hay nada almacenado, default es `false`
    });

    const toggleHighContrast = () => {
        setIsHighContrast(prev => {
            const newState = !prev;
            localStorage.setItem('highContrast', String(newState)); // Almacena el nuevo estado en localStorage
            return newState;
        });
    };

    return (
        <HighContrastContext.Provider value={{ isHighContrast, toggleHighContrast }}>
            {children}
        </HighContrastContext.Provider>
    );
};
