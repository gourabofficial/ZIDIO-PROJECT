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
import AddAddress from "./_root/pages/AddAddress";

// import admin

import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/components/AdminDashboard";
import AddProduct from "./admin/components/AddProduct";
import OrderAdmin from "./admin/components/OrderList";
import AllProductList from "./admin/components/AllProductList";
import AdminUser from "./admin/components/AdminUser";








const App = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        // root layout
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="/category/:id" element={<Category />} />
          <Route path="/collection/:id" element={<Collection />} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route path="/search" element={<Search />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/account" element={<Account />} />
          <Route path="/account-settings" element={<AccountSettings />} />
          <Route path="/edit-profile" element={ <EditProfile />} />
          <Route path="/add-address" element={ <AddAddress />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/orders" element={<Order />} />
          <Route path="/offers" element={<Offer />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        //auth layout
        <Route element={<AuthLayout />}>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
        </Route>

        //admin layout
         <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="/admin/add-products" element={<AddProduct />} />
          <Route path="/admin/products-list" element={<AllProductList />} />
          <Route path="/admin/all-orders" element={<OrderAdmin />} />
          <Route path="/admin/all-users" element={<AdminUser />} />
          
          

         
        </Route> 

      </Routes>
    </>
  );
};

export default App;