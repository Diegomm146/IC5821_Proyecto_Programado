import { ReactNode } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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
import { AuthProvider, useAuth } from '../util/AuthContext';

function LayoutWithHeaderAndFooter({ children }: { children: ReactNode }) {
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  );
}

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();

  console.log('current user in privateroute:', user);
  if (!user || user.type !== 'entrepreneur') {
      console.log('redirecting because user is not an entrepreneur:', user);
      return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LayoutWithHeaderAndFooter><Home /></LayoutWithHeaderAndFooter>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register-client" element={<RegisterClient />} />
        <Route path="/register-entrepreneur" element={<EntrepreneurRegistration />} />
        <Route path="/client-profile" element={<LayoutWithHeaderAndFooter><ClientProfile /></LayoutWithHeaderAndFooter>} />
        <Route path="/product-view/:productId" element={<LayoutWithHeaderAndFooter><ProductView /></LayoutWithHeaderAndFooter>} />
        <Route path="/checkout" element={<LayoutWithHeaderAndFooter><Checkout /></LayoutWithHeaderAndFooter>} />
        <Route path="/client-orders" element={<LayoutWithHeaderAndFooter><ClientOrders /></LayoutWithHeaderAndFooter>} />
        <Route path="/cart" element={<LayoutWithHeaderAndFooter><Cart /></LayoutWithHeaderAndFooter>} />
        <Route path="/entrepreneur-profile" element={<PrivateRoute><LayoutWithHeaderAndFooter><EntrepreneurProfile /></LayoutWithHeaderAndFooter></PrivateRoute>} />
        <Route path="/entrepreneur-orders" element={<PrivateRoute><LayoutWithHeaderAndFooter><EntrepreneurOrders /></LayoutWithHeaderAndFooter></PrivateRoute>} />
        <Route path="/create-product" element={<PrivateRoute><LayoutWithHeaderAndFooter><CreateProduct /></LayoutWithHeaderAndFooter></PrivateRoute>} />
        <Route path="/edit-product/:productId" element={<PrivateRoute><LayoutWithHeaderAndFooter><EditProduct /></LayoutWithHeaderAndFooter></PrivateRoute>} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
