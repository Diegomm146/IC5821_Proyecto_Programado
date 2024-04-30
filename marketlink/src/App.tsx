import { ReactNode } from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../screens/login/Login';
import RegisterClient from '../screens/registerClient/RegisterClient';
import ClientProfile from '../screens/clientProfile/ClientProfile';
import EntrepreneurRegistration from '../screens/entrepreneurRegistration/EntrepreneurRegistration';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import ProductView from '../screens/productView/ProductView';
import Checkout from '../screens/checkout/Checkout';
import ClientOrders from '../screens/clientOrders/ClientOrders';
import Cart from '../screens/cart/Cart';
import Home from '../screens/home/Home';
import EntrepreneurProfile from '../screens/entrepreneurProfile/EntrepreneurProfile';

function App() {
  return (
    <Routes>
      {/* */}
      <Route path="/client-profile" element={<LayoutWithHeaderAndFooter><ClientProfile /></LayoutWithHeaderAndFooter>} />
      <Route path="/login" element={<LayoutWithHeaderAndFooter><Login /></LayoutWithHeaderAndFooter>} />
      <Route path="/register-client" element={<LayoutWithHeaderAndFooter><RegisterClient /></LayoutWithHeaderAndFooter>} />
      <Route path="/product-view" element={<LayoutWithHeaderAndFooter><ProductView /></LayoutWithHeaderAndFooter>} /> 
      <Route path="/checkout" element={<LayoutWithHeaderAndFooter><Checkout /></LayoutWithHeaderAndFooter>} />
      <Route path="/client-orders" element={<LayoutWithHeaderAndFooter><ClientOrders /></LayoutWithHeaderAndFooter>} />
      <Route path="/cart" element={<LayoutWithHeaderAndFooter><Cart /></LayoutWithHeaderAndFooter>} />
      <Route path="/home" element={<LayoutWithHeaderAndFooter><Home /></LayoutWithHeaderAndFooter>} />
      {/* */}
      <Route path="/entrepreneur-profile" element={<LayoutWithHeaderAndFooter><EntrepreneurProfile /></LayoutWithHeaderAndFooter>} />
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
