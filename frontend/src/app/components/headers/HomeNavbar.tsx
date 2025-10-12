import {
  Box,
  Container,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

/* i18n */
import { useTranslation } from "react-i18next";
import i18n from "../../../i18n";

/* Shu papkadagi komponentlar (nom/katta-kichik harf aynan mos bo‘lsin!) */
import Basket from "./Basket";
import UserMenu from "./avatar";

/* Turlar va global context */
import { CartItem } from "../../../lib/types/search";
import { useGlobals } from "../../hooks/useGlobals";

interface HomeNavbarProps {
  cartItems: CartItem[];
  onAdd: (item: CartItem) => void;
  onRemove: (item: CartItem) => void;
  onDelete: (item: CartItem) => void;
  onDeleteAll: () => void;
}

export default function HomeNavbar(props: HomeNavbarProps) {
  const { cartItems, onAdd, onRemove, onDelete, onDeleteAll } = props;

  // i18n hook
  const { t } = useTranslation();

  // Global foydalanuvchi holati
  const { authMember } = useGlobals();

  // Til holati (i18n’dan boshlang‘ich qiymat)
  const [language, setLanguage] = useState<string>(i18n.language || "en");

  // i18n til o‘zgarsa, local state ham yangilansin
  useEffect(() => {
    const handler = (lng: string) => setLanguage(lng);
    i18n.on("languageChanged", handler);
    return () => {
      i18n.off("languageChanged", handler);
    };
  }, []);

  const handleChange = (e: SelectChangeEvent) => {
    const next = String(e.target.value);
    i18n.changeLanguage(next);
    localStorage.setItem("lng", next);
    setLanguage(next);
  };

  return (
    <div className="home-navbar">
      <Container className="navbar-container">
        {/* Yuqori promo banner (ixtiyoriy tarjima — hozircha o‘zgartirmadik) */}
        <Stack
          className="navbar-wrapper"
          flexDirection={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Stack className="text-btn" flexDirection={"row"}>
            <Box className="nav-text">
              Summer Sale For All Swim Suits And Free Express Delivery - OFF
              50%!
            </Box>
            <Box>
              <NavLink to={"/products"} className="showNow-btn">
                ShopNow
              </NavLink>
            </Box>
          </Stack>

          {/* Language selector */}
          <Box className="lang-change">
            <FormControl className="ll" fullWidth variant="standard">
              <Select
                id="language-select"
                value={language}
                onChange={handleChange}
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="ko">한국어</MenuItem>
                <MenuItem value="uz">O‘zbekcha</MenuItem>
                {/* Agar rus tili qo‘shmoqchi bo‘lsang keyin ru/common.json qo‘shamiz */}
              </Select>
            </FormControl>
          </Box>
        </Stack>

        {/* Pastki navbar */}
        <Stack className="navbar-bott-wrapper">
          <Box className="nav-logo">
            <img src="/icons/Exclusive-logo.svg" alt="logo" />
          </Box>

          {/* Navigatsiya linklari */}
          <Stack className="nav-links" flexDirection={"row"}>
            <NavLink exact to="/" activeClassName="underline">
              {t("nav.home")}
            </NavLink>
            <NavLink to={"/products"} activeClassName="underline">
              {t("nav.products")}
            </NavLink>
            {authMember ? (
              ""
            ) : (
              <NavLink to={"/login"} activeClassName="underline">
                {t("auth.login")}
              </NavLink>
            )}

            {/* Login bo‘lgan foydalanuvchi uchun Cart/Orders, bo‘lmasa Sign Up */}
            {authMember ? (
              <NavLink to={"/cart"} activeClassName="underline">
                {t("nav.cart")}
              </NavLink>
            ) : (
              <NavLink to={"/signup"} activeClassName="underline">
                {t("auth.signup")}
              </NavLink>
            )}
          </Stack>

          {/* Qidiruv maydoni */}
          <Box className="nav-search">
            <input type="text" placeholder={t("nav.searchPlaceholder")} />
            <SearchIcon />
          </Box>

          {/* Ikkonlar (like, basket, user menu) */}
          <Stack
            className="nav-dashboard"
            flexDirection={"row"}
            justifyContent={"space-between"}
          >
            <Box className="hover-line">
              <FavoriteBorderIcon className="nav-like" />
            </Box>

            <Box className="hover-line">
              <Basket
                cartItems={cartItems}
                onAdd={onAdd}
                onRemove={onRemove}
                onDelete={onDelete}
                onDeleteAll={onDeleteAll}
              />
            </Box>

            {authMember && (
              <Box className="hover-line">
                <UserMenu />
              </Box>
            )}
          </Stack>
        </Stack>
      </Container>
    </div>
  );
}
