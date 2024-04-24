import React, { ReactNode } from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../screens/login/Login';
import RegisterClient from '../screens/registerClient/RegisterClient';
import ClientProfile from '../screens/clientProfile/ClientProfile';
import EntrepreneurRegistration from '../screens/entrepreneurRegistration/EntrepreneurRegistration';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';

function App() {
  return (
    <Routes>
      {/* */}
      <Route path="/" element={<LayoutWithHeaderAndFooter><ClientProfile /></LayoutWithHeaderAndFooter>} />
      <Route path="/login" element={<LayoutWithHeaderAndFooter><Login /></LayoutWithHeaderAndFooter>} />
      <Route path="/register-client" element={<LayoutWithHeaderAndFooter><RegisterClient /></LayoutWithHeaderAndFooter>} />

      {/* */}
      <Route path="/register-entrepreneur" element={<EntrepreneurRegistration />} />
    </Routes>
  );
}

// componente que contiene header y footer para separar aquellas pantallas que no lo requierien
function LayoutWithHeaderAndFooter({ children }: { children: ReactNode }) {
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  );
}

export default App;