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
import  Product  from "./_root/pages/Product";
import Order from "./_root/pages/Order";
import  Offer  from "./_root/pages/Offer";
import  NotFound  from "./_root/pages/NotFound";
import Account from "./_root/pages/Account";
import AuthLayout from "./_auth/AuthLayout";
import SignIn from "./_auth/pages/SignIn";
import  SignUp  from "./_auth/pages/SignUp";

const App = () => {
  return (
    <>
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
          <Route path="/product" element={<Product />} />
          <Route path="/orders" element={<Order />} />
          <Route path="/offers" element={<Offer />} />
          <Route path="/notFound" element={<NotFound />} />
        </Route>
        //auth layout
        <Route element={<AuthLayout />}>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
