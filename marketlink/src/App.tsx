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
import EntrepreneurOrders from '../screens/entrepreneurOrders/EntrepreneurOrders';
import CreateProduct from '../screens/createProduct/CreateProduct';
import EditProduct from '../screens/editProduct/EditProduct';
import { ToastContainer } from 'react-toastify';

function LayoutWithHeaderAndFooter({ children }: { children: ReactNode }) {
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  );
}

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LayoutWithHeaderAndFooter><Home /></LayoutWithHeaderAndFooter>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register-client" element={<RegisterClient />} />
        <Route path="/client-profile" element={<LayoutWithHeaderAndFooter><ClientProfile /></LayoutWithHeaderAndFooter>} />
        <Route path="/register-entrepreneur" element={<EntrepreneurRegistration />} />
        <Route path="/product-view" element={<LayoutWithHeaderAndFooter><ProductView /></LayoutWithHeaderAndFooter>} />
        <Route path="/checkout" element={<LayoutWithHeaderAndFooter><Checkout /></LayoutWithHeaderAndFooter>} />
        <Route path="/client-orders" element={<LayoutWithHeaderAndFooter><ClientOrders /></LayoutWithHeaderAndFooter>} />
        <Route path="/cart" element={<LayoutWithHeaderAndFooter><Cart /></LayoutWithHeaderAndFooter>} />
        <Route path="/entrepreneur-profile" element={<EntrepreneurProfile />} />
        <Route path="/entrepreneur-orders" element={<LayoutWithHeaderAndFooter><EntrepreneurOrders /></LayoutWithHeaderAndFooter>} />
        <Route path="/create-product" element={<LayoutWithHeaderAndFooter><CreateProduct /></LayoutWithHeaderAndFooter>} />
        <Route path="/edit-product/:productId" element={<LayoutWithHeaderAndFooter><EditProduct /></LayoutWithHeaderAndFooter>} /> {/* Modificado para incluir parámetro */}
      </Routes>
      <ToastContainer position="top-center" />
    </>
  );
}

export default App;
