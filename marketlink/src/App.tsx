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
        <Route path="/client-profile" element={<ClientProfile />} />
        <Route path="/register-entrepreneur" element={<EntrepreneurRegistration />} />
        <Route path="/product-view" element={<ProductView />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/client-orders" element={<ClientOrders />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/entrepreneur-profile" element={<EntrepreneurProfile />} />
        <Route path="/entrepreneur-orders" element={<LayoutWithHeaderAndFooter><EntrepreneurOrders /></LayoutWithHeaderAndFooter>} />
        <Route path="/create-product" element={<LayoutWithHeaderAndFooter><CreateProduct /></LayoutWithHeaderAndFooter>} />
        <Route path="/register-entrepreneur" element={<EntrepreneurRegistration />} />
        <Route path="/edit-product" element={<LayoutWithHeaderAndFooter><EditProduct /></LayoutWithHeaderAndFooter>} />
      </Routes>
      <ToastContainer position="top-center" />
    </>
  );
}

export default App;
