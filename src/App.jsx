import React from "react";
import axios from "axios";
// Set the base URL so you don't have to type it every time
axios.defaults.baseURL = "http://localhost:3000";
// MUST BE TRUE to send/receive cookies
axios.defaults.withCredentials = true;
import LoginForm from "./pages/auth/Login";
import SignUpForm from "./pages/auth/Sign-up";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MarketPlace from "./pages/MarketPlace";
import { RequireAuth, RequireNoAuth } from "./middlewares/AuthGaurd";
import ItemDetails from "./pages/ItemDetails";
import OrdersDashboard from "./pages/customer/profile/orders/OrdersDashboard";
import InquiriesDashboard from "./pages/customer/profile/inquiries/InquiryDashboard";
import AccountDashboard from "./pages/customer/profile/account/AccountDashboard";
import OverviewDashboard from "./pages/seller/dashboard/overview/OverviewDashboard";
import { UserProvider } from "./context/UserContext";

const App = () => {
  return (
    <>
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<RequireNoAuth />}>
              <Route path="/" element={<LoginForm />} />
              <Route path="/sign-up" element={<SignUpForm />} />
            </Route>
            <Route element={<RequireAuth />}>
              <Route path="/marketplace" element={<MarketPlace />} />
              <Route path="/details/:category/:id" element={<ItemDetails />} />
              {/* Customer Routes */}
              <Route path="/profile" element={<OrdersDashboard />} />
              <Route
                path="/profile/inquiries"
                element={<InquiriesDashboard />}
              />
              <Route path="/profile/account" element={<AccountDashboard />} />

              {/* Seller Routes */}
              <Route
                path="/seller/dashboard/overview"
                element={<OverviewDashboard />}
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </>
  );
};

export default App;
