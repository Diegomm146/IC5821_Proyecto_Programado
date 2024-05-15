import { ReactNode, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../screens/login/Login";
import RegisterClient from "../screens/registerClient/RegisterClient";
import ClientProfile from "../screens/clientProfile/ClientProfile";
import EntrepreneurRegistration from "../screens/entrepreneurRegistration/EntrepreneurRegistration";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import ProductView from "../screens/productView/ProductView";
import Checkout from "../screens/checkout/Checkout";
import ClientOrders from "../screens/clientOrders/ClientOrders";
import Cart from "../screens/cart/Cart";
import Home from "../screens/home/Home";
import EntrepreneurProfile from "../screens/entrepreneurProfile/EntrepreneurProfile";
import EntrepreneurOrders from "../screens/entrepreneurOrders/EntrepreneurOrders";
import CreateProduct from "../screens/createProduct/CreateProduct";
import EditProduct from "../screens/editProduct/EditProduct";
import { AuthProvider, useAuth } from "../util/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  HighContrastProvider,
  useHighContrast,
} from "./assets/HighContrastContext";

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

  if (!user || user.type !== "entrepreneur") {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  const { isHighContrast } = useHighContrast();

  useEffect(() => {}, [isHighContrast]);

  return (
    <AuthProvider>
      <HighContrastProvider>
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <Routes>
          <Route
            path="/*"
            element={
              <LayoutWithHeaderAndFooter>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register-client" element={<RegisterClient />} />
                  <Route
                    path="/register-entrepreneur"
                    element={<EntrepreneurRegistration />}
                  />
                  <Route path="/client-profile" element={<ClientProfile />} />
                  <Route
                    path="/product-view/:productId"
                    element={<ProductView />}
                  />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/client-orders" element={<ClientOrders />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route
                    path="/entrepreneur-profile"
                    element={
                      <PrivateRoute>
                        <EntrepreneurProfile />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/entrepreneur-orders"
                    element={
                      <PrivateRoute>
                        <EntrepreneurOrders />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/create-product"
                    element={
                      <PrivateRoute>
                        <CreateProduct />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/edit-product/:productId"
                    element={
                      <PrivateRoute>
                        <EditProduct />
                      </PrivateRoute>
                    }
                  />
                </Routes>
              </LayoutWithHeaderAndFooter>
            }
          />
        </Routes>
      </HighContrastProvider>
    </AuthProvider>
  );
}

export default App;
