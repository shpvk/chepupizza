import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login/Login";
import ForgotPassword from "./pages/Login/ForgotPassword";
import SignUp from "./pages/Login/SignUp";
import Promotions from "./pages/Promotions/Promotions";
import About from "./pages/About";
import Cart from "./pages/Cart/Cart";
import Order from "./pages/Order/Order";
import Profile from "./pages/Profile/Profile";
import PizzaConstructorPage from "./components/constructor/PizzaConstructorPage";
import RequireAuth from "./components/RequireAuth";
import { preloadIngredients } from "./components/constructor/useIngredients";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Catalog from "./pages/catalog/catalog.jsx";
import NotFound from "./pages/NotFound/NotFound";

function App() {
  useEffect(() => {
    preloadIngredients().catch(() => {});
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/constructor" element={<PizzaConstructorPage />} />
            <Route path="/promotions" element={<Promotions />} />
            <Route path="/about" element={<About />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route
              path="/profile"
              element={
                <RequireAuth>
                  <Profile />
                </RequireAuth>
              }
            />
            <Route
              path="/order"
              element={
                <RequireAuth>
                  <Order />
                </RequireAuth>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;