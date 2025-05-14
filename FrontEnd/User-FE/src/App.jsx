import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import FarmHub from "./pages/FarmHub";
import ChatAI from "./pages/ChatAI";
import News from "./pages/News";
import NewsDetail from "./pages/NewsDetail";
import AboutUs from "./pages/AboutUs";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Main from "./pages/Main";
import RequireAuth from "./auth/requireAuth";
import NoFoundPage from "./pages/NoFoundPage";
import FarmHub2 from "./pages/FarmHub2";
import CategoryPage from "./pages/CategoryPage ";
import ProductDetail from "./pages/ProductDetail";
import Coupons from "./pages/Coupons";
import UserProfile from "./pages/UserProfile";
import UserSearchPage from "./pages/UserSearchPage";
import EditProfile from "./pages/EditProfile";
import WeatherDashboard from "./pages/WeatherDashboard";
import Subscriptions from "./pages/Subscriptions";
import SubscriptionDetails from "./pages/SubscriptionDetails";
import SubscriptionPayment from "./pages/SubscriptionPayment";
import SubscriptionPlans from "./pages/admin/SubscriptionPlans";
import PaymentResult from "./pages/PaymentResult";

import Category from "./components/farmhub2/Category";
import NewProducts from "./components/farmhub2/NewProducts";
import SearchPage from "./pages/SearchPage";
import Cart from "./pages/Cart";
import Checkout from "./components/checkout/CheckOut";
import OrderSuccess from "./components/checkout/OrderSuccess";
import OrderHistory from "./components/checkout/OrderHistory";
import OrderDetail from "./components/checkout/OrderDetail";
import FeaturedProducts from "./components/farmhub2/FeaturedProducts";
import OnSaleProducts from "./components/farmhub2/OnSaleProducts";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const ROLES = {
  User: "User",
  Admin: "Admin",
};

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Main />}>
            <Route index element={<Home />} />
            <Route path="home" element={<Home />} />
            <Route path="about" element={<AboutUs />} />
            <Route path="news" element={<News />} />
            <Route path="news/:id" element={<NewsDetail />} />
            <Route path="weather" element={<WeatherDashboard />} />
            <Route path="subscriptions" element={<Subscriptions />} />
            <Route path="subscriptions/:id" element={<SubscriptionDetails />} />
            <Route path="account">
              <Route path="register" element={<Register />} />
              <Route path="login" element={<Login />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="reset-password" element={<ResetPassword />} />
            </Route>
            <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
              <Route path="profile/:userId" element={<UserProfile />} />
              <Route path="profile/edit" element={<EditProfile />} />
              <Route path="users/search" element={<UserSearchPage />} />
              <Route path="farmhub2" element={<FarmHub2 />}>
                <Route
                  index
                  element={
                    <>
                      <Category />
                      <FeaturedProducts />
                      <OnSaleProducts />
                      <NewProducts />
                    </>
                  }
                />
                <Route path="category/:id" element={<CategoryPage />} />
                <Route path="search" element={<SearchPage />} />
                <Route path="popular" element={<FeaturedProducts />} />
                <Route path="on-sale" element={<OnSaleProducts />} />
                <Route path="recently-updated" element={<FeaturedProducts />} />
              </Route>
              <Route path="farmhub2/product/:id" element={<ProductDetail />} />
              <Route path="farmhub" element={<FarmHub />} />
              <Route path="chat-ai" element={<ChatAI />} />
              <Route path="coupons" element={<Coupons />} />
              <Route path="cart" element={<Cart />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="order-success" element={<OrderSuccess />} />
              <Route path="order-history" element={<OrderHistory />} />
              <Route path="order/:id" element={<OrderDetail />} />
              <Route path="payment/result" element={<PaymentResult />} />
              <Route
                path="payment/subscription/:id"
                element={<SubscriptionPayment />}
              />
              <Route
                path="admin/subscriptions"
                element={<SubscriptionPlans />}
              />
            </Route>
            <Route path="*" element={<NoFoundPage />} />
          </Route>
        </Routes>
      </Router>

      {/* Add React Query Devtools - only in development */}
      {import.meta.env.DEV && (
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      )}
    </>
  );
}

export default App;
