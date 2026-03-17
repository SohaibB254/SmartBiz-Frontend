import React from "react";
import axios from "axios";
import LoginForm from "./pages/auth/Login";
import SignUpForm from "./pages/auth/Sign-up";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MarketPlace from "./pages/MarketPlace";
import { RequireAuth, RequireNoAuth } from "./middlewares/AuthGaurd";
import ItemDetails from "./pages/ItemDetails";
import OrdersDashboard from "./pages/customer/profile/orders/OrdersDashboard";
import InquiriesDashboard from "./pages/customer/profile/inquiries/InquiryDashboard";
import AccountDashboard from "./pages/customer/profile/account/AccountDashboard";
import OverviewDashboard from "./pages/seller/dashboard/overview/SellerOverview";
import { UserProvider } from "./context/UserContext";
import { BusinessProvider } from "./context/BusinessContext";
import AddBusiness from "./pages/seller/dashboard/business-profile/AddBusiness";
import BusinessProfile from "./pages/seller/dashboard/business-profile/BusinessProfile";
import { ListingProvider } from "./context/ListingsContext";
import SellerListings from "./pages/seller/dashboard/listings/SellerListings";
import ManageListing from "./pages/seller/dashboard/listings/ManageListing";
import SellerOrders from "./pages/seller/dashboard/orders/SellerOrders";
import SellerInquiries from "./pages/seller/dashboard/inquiries/SellerInquiries";
import SellerAccount from "./pages/seller/dashboard/account/SellerAccount";
import { SellerOrderProvider } from "./context/SellerOrdersContext";
import { SellerInquiryProvider } from "./context/SellerInquiryContext";
import SellerOverview from "./pages/seller/dashboard/overview/SellerOverview";
import API_HOST from "./config";
// Set the base URL so you don't have to type it every time
axios.defaults.baseURL = API_HOST;
// MUST BE TRUE to send/receive cookies
axios.defaults.withCredentials = true;

const App = () => {
  return (
    <>
      <UserProvider>
        <BusinessProvider>
          <SellerInquiryProvider>
            <SellerOrderProvider>
              <ListingProvider>
                <BrowserRouter>
                  <Routes>
                    <Route element={<RequireNoAuth />}>
                      <Route path="/" element={<LoginForm />} />
                      <Route path="/sign-up" element={<SignUpForm />} />
                    </Route>
                    <Route element={<RequireAuth />}>
                      <Route path="/marketplace" element={<MarketPlace />} />
                      <Route
                        path="/details/:category/:id"
                        element={<ItemDetails />}
                      />
                      {/* Customer Routes */}
                      <Route path="/profile" element={<OrdersDashboard />} />
                      <Route
                        path="/profile/inquiries"
                        element={<InquiriesDashboard />}
                      />
                      <Route
                        path="/profile/account"
                        element={<AccountDashboard />}
                      />

                      {/* Seller Routes */}
                      <Route
                        path="/seller/dashboard/add-business"
                        element={<AddBusiness />}
                      />
                      <Route
                        path="/seller/overview"
                        element={<SellerOverview />}
                      />
                      <Route
                        path="/seller/profile"
                        element={<BusinessProfile />}
                      />
                      <Route
                        path="/seller/listings"
                        element={<SellerListings />}
                      />
                      <Route
                        path="/seller/listings/:id"
                        element={<ManageListing />}
                      />
                      <Route path="/seller/orders" element={<SellerOrders />} />
                      <Route
                        path="/seller/inquiries"
                        element={<SellerInquiries />}
                      />
                      <Route
                        path="/seller/account"
                        element={<SellerAccount />}
                      />
                    </Route>
                  </Routes>
                </BrowserRouter>
              </ListingProvider>
            </SellerOrderProvider>
          </SellerInquiryProvider>
        </BusinessProvider>
      </UserProvider>
    </>
  );
};

export default App;
