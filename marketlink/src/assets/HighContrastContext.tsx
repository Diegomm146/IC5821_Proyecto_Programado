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
        const stored = localStorage.getItem('highContrast');
        console.log('Initial high contrast state:', stored);
        return stored === 'true' ? true : false;
    });

    const toggleHighContrast = () => {
        setIsHighContrast(prev => {
            const newState = !prev;
            localStorage.setItem('highContrast', String(newState));
            console.log('High contrast toggled:', newState);
            return newState;
        });
    };

    return (
        <HighContrastContext.Provider value={{ isHighContrast, toggleHighContrast }}>
            {children}
        </HighContrastContext.Provider>
    );
};
