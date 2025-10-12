import React, { useState } from "react";
import '../i18n';
// import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { Link, Route, Switch, useLocation } from "react-router-dom";
import HomePage from "./screens/HomePage";
import Account from "./screens/Account";
import Cart from "./screens/Cart";
import ErrorPage from "./screens/ErrorPage";
import Login from "./screens/Login";
import ProductDetails from "./screens/ProductDetails";
import Signup from "./screens/Signup";
import HomeNavbar from "./components/headers/HomeNavbar";

import OtherNavbar from "./components/headers/OtherNavbar";
import Footer from "./components/footer";

import ProductsPage from "./screens/Products";
import { CartItem } from "../lib/types/search";
import useBasket from "./hooks/useBasket";
import { useGlobals } from "./hooks/useGlobals";
import "../css/app.css";
import "../css/navbar.css";
import "../css/footer.css";
import "../css/products.css";

function App() {
  const location = useLocation();
  const { authMember, setAuthMember } = useGlobals();
  const { cartItems, onAdd, onRemove, onDelete, onDeleteAll } = useBasket();
  const [signupOpen, setSignupOpen] = useState<boolean>(false);
  const [loginOpen, setLoginOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  return (
    <React.Suspense fallback={<div />}>
      <HomeNavbar
        cartItems={cartItems}
        onAdd={onAdd}
        onRemove={onRemove}
        onDelete={onDelete}
        onDeleteAll={onDeleteAll}
      />
      <Switch>
        <Route exact path="/">
          <HomePage
            onAdd={onAdd}
            onRemove={onRemove}
            onDelete={onDelete}
            onDeleteAll={onDeleteAll}
          />
        </Route>

        <Route path="/products">
          <ProductsPage
            onAdd={onAdd}
            onRemove={onRemove}
            onDelete={onDelete}
            onDeleteAll={onDeleteAll}
          />
        </Route>

        <Route path="/login">
          <Login />
        </Route>

        <Route path="/signup">
          <Signup />
        </Route>

        <Route path="/account">
          <Account />
        </Route>
        <Route path="/cart">
          <Cart
            onAdd={onAdd}
            onRemove={onRemove}
            onDelete={onDelete}
            onDeleteAll={onDeleteAll}
          />
        </Route>

        <Route path={"/errorPage"}>
          <ErrorPage />
        </Route>
        <Route>
          <ErrorPage />
        </Route>
      </Switch>

      <Footer />
    </React.Suspense>
  );
}

export default App;
