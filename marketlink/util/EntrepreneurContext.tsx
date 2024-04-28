import React from 'react';

interface Entrepreneur {
    uid: string;
    name: string;
    phoneNumber: string;
    email: string;
    description: string;
    logoURL: string;
    province: string;
    canton: string;
    district: string;
}

const EntrepreneurContext = React.createContext<Entrepreneur | null>(null);

export default EntrepreneurContext;