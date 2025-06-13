import React from "react";
import { Route, Routes } from "react-router-dom";
import RootLayout from "./_root/Layout";
import Home from "./_root/pages/Home";
import Category from "./_root/pages/Category";
import Collection from "./_root/pages/Collection";
import TrackOrder from "./_root/pages/TrackOrder";
import Search from "./_root/pages/Search";
import Wishlist from "./_root/pages/Wishlist";
import Cart from "./_root/pages/Cart";
import Product from "./_root/pages/Product";
import Order from "./_root/pages/Order";
import Offer from "./_root/pages/Offer";
import NotFound from "./_root/pages/NotFound";
import Account from "./_root/pages/Account";
import AuthLayout from "./_auth/AuthLayout";
import SignIn from "./_auth/pages/SignIn";
import SignUp from "./_auth/pages/SignUp";
import ScrollToTop from "./components/common/ScrollToTop";
import AccountSettings from "./_root/pages/AccountSettings";
import EditProfile from "./_root/pages/EditProfile";

// Admin imports
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/components/AdminDashboard";
import AddProduct from "./admin/components/AddProduct";
import OrderAdmin from "./admin/components/OrderList";
import AllProductList from "./admin/components/AllProductList";
import AdminUser from "./admin/components/AdminUser";
import AdminSettings from "./admin/components/AdminSettings";
import AdminProductDetails from "./admin/components/AdminProductDetails";
import AdminUpdateProduct from "./admin/components/AdminUpdateProduct";
import Checkout from "./_root/pages/Checkout";
import PaymentSuccess from "./_root/pages/PaymentSuccess";
import PaymentCancel from "./_root/pages/PaymentCancel";
import AdminInventory from "./admin/components/AdminInventory";
import { useAuthdata } from "./context/AuthContext";

const App = () => {
  const { token } = useAuthdata();
  console.log(token);
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Root layout */}
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="/category/:id" element={<Category />} />
          <Route path="/category" element={<Category />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/collection/:id" element={<Collection />} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route path="/search" element={<Search />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/account" element={<Account />} />
          <Route path="/account-settings" element={<AccountSettings />} />
          <Route path="/settings" element={<AccountSettings />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/orders" element={<Order />} />
          <Route path="/offers" element={<Offer />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-cancel" element={<PaymentCancel />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        {/* Auth layout */}
        <Route element={<AuthLayout />}>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
        </Route>

        {/* Admin layout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="add-products" element={<AddProduct />} />
          <Route path="edit-products/:id" element={<AdminUpdateProduct />} />
          <Route path="products-list" element={<AllProductList />} />
          <Route path="product-details/:id" element={<AdminProductDetails />} />
          <Route path="all-orders" element={<OrderAdmin />} />
          <Route path="all-users" element={<AdminUser />} />
          <Route path="stock" element={<AdminInventory/> }/>
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
