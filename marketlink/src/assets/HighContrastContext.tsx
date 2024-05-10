import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AltoContrastContextType {
    isHighContrast: boolean;
    toggleHighContrast: () => void;
}

const defaultState = {
    isHighContrast: false, 
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
        
        return stored === 'true' ? true : false;
    });

    const toggleHighContrast = () => {
        setIsHighContrast(prev => {
            const newState = !prev;
            localStorage.setItem('highContrast', String(newState));
            
            return newState;
        });
    };

    return (
        <HighContrastContext.Provider value={{ isHighContrast, toggleHighContrast }}>
            {children}
        </HighContrastContext.Provider>
    );
};
