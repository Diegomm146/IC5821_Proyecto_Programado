import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface HighContrastContextType {
    isHighContrast: boolean;
    toggleHighContrast: () => void;
}

const defaultState: HighContrastContextType = {
    isHighContrast: false,
    toggleHighContrast: () => {}
};

const HighContrastContext = createContext<HighContrastContextType>(defaultState);

export const useHighContrast = () => useContext(HighContrastContext);

interface Props {
    children: ReactNode;
}

export const HighContrastProvider: React.FC<Props> = ({ children }) => {
    const [isHighContrast, setIsHighContrast] = useState<boolean>(() => {
        const stored = localStorage.getItem('highContrast');
        return stored === 'true';
    });

    const [announcement, setAnnouncement] = useState<string>('');

    const toggleHighContrast = () => {
        setIsHighContrast(prev => {
            const newState = !prev;
            localStorage.setItem('highContrast', String(newState));
            setAnnouncement(newState ? 'High contrast mode enabled' : 'High contrast mode disabled');
            return newState;
        });
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => setAnnouncement(''), 3000);
        return () => clearTimeout(timeoutId);
    }, [announcement]);

    return (
        <HighContrastContext.Provider value={{ isHighContrast, toggleHighContrast }}>
            <div>
                {children}
                <div aria-live="polite" style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
                    {announcement}
                </div>
            </div>
        </HighContrastContext.Provider>
    );
};
