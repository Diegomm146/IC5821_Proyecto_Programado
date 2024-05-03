import { ReactNode } from 'react';
import { Routes, Route , Navigate } from 'react-router-dom';
import Login from '../screens/login/Login.tsx';
import RegisterClient from '../screens/registerClient/RegisterClient.tsx';
import ClientProfile from '../screens/clientProfile/ClientProfile.tsx';
import EntrepreneurRegistration from '../screens/entrepreneurRegistration/EntrepreneurRegistration.tsx';
import Header from './components/header/Header.tsx';
import Footer from './components/footer/Footer.tsx';
import ProductView from '../screens/productView/ProductView.tsx';
import Checkout from '../screens/checkout/Checkout.tsx';
import ClientOrders from '../screens/clientOrders/ClientOrders.tsx';
import Cart from '../screens/cart/Cart.tsx';
import Home from '../screens/home/Home.tsx';
import EntrepreneurProfile from '../screens/entrepreneurProfile/EntrepreneurProfile.tsx';
import EntrepreneurOrders from '../screens/entrepreneurOrders/EntrepreneurOrders.tsx';
import CreateProduct from '../screens/createProduct/CreateProduct.tsx';
import EditProduct from '../screens/editProduct/EditProduct.tsx';
import { AuthProvider, useAuth } from '../util/AuthContext.tsx';

function LayoutWithHeaderAndFooter({ children }: { children : ReactNode}) {
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  );
}

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();

  console.log('Current user in PrivateRoute:', user);
  if (!user || user.type !== 'entrepreneur') {
      console.log('Redirecting because user is not an entrepreneur:', user);
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
        <Route path="/client-profile" element={<LayoutWithHeaderAndFooter><ClientProfile /></LayoutWithHeaderAndFooter>} />
        <Route path="/register-entrepreneur" element={<EntrepreneurRegistration />} />
        <Route path="/product-view/:productId" element={<LayoutWithHeaderAndFooter><ProductView /></LayoutWithHeaderAndFooter>} />
        <Route path="/checkout" element={<LayoutWithHeaderAndFooter><Checkout /></LayoutWithHeaderAndFooter>} />
        <Route path="/client-orders" element={<LayoutWithHeaderAndFooter><ClientOrders /></LayoutWithHeaderAndFooter>} />
        <Route path="/cart" element={<LayoutWithHeaderAndFooter><Cart /></LayoutWithHeaderAndFooter>} />
        <Route path="/entrepreneur-profile" element={<PrivateRoute><LayoutWithHeaderAndFooter><EntrepreneurProfile /></LayoutWithHeaderAndFooter></PrivateRoute>} />
        <Route path="/entrepreneur-orders" element={<PrivateRoute><LayoutWithHeaderAndFooter><EntrepreneurOrders /></LayoutWithHeaderAndFooter></PrivateRoute>} />
        <Route path="/create-product" element={<PrivateRoute><LayoutWithHeaderAndFooter><CreateProduct /></LayoutWithHeaderAndFooter></PrivateRoute>} />
        <Route path="/edit-product/:productId" element={<PrivateRoute><LayoutWithHeaderAndFooter><EditProduct /></LayoutWithHeaderAndFooter></PrivateRoute>} />
        <Route path="/entrepreneur-profile" element={<PrivateRoute><LayoutWithHeaderAndFooter><EntrepreneurProfile /></LayoutWithHeaderAndFooter></PrivateRoute>} />
        <Route path="/entrepreneur-orders" element={<PrivateRoute><LayoutWithHeaderAndFooter><EntrepreneurOrders /></LayoutWithHeaderAndFooter></PrivateRoute>} />
        <Route path="/create-product" element={<PrivateRoute><LayoutWithHeaderAndFooter><CreateProduct /></LayoutWithHeaderAndFooter></PrivateRoute>} />
        <Route path="/edit-product/:productId" element={<PrivateRoute><LayoutWithHeaderAndFooter><EditProduct /></LayoutWithHeaderAndFooter></PrivateRoute>} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
