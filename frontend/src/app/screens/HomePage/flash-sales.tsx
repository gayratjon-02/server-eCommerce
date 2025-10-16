import React from "react";

import { Badge, Box, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import { NavLink, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrieveFlashSales } from "./selector";
import { serverApi } from "../../../lib/config";
import { useCountdown } from "./useCountdown";
import { CartItem } from "../../../lib/types/search";

/** === REDUX SELECTOR === */
const flashSalesRetriever = createSelector(
  retrieveFlashSales,
  (flashSales) => flashSales
);

interface FlashSalesProps {
  onAdd: (item: CartItem) => void;
}

export default function FlashSales({ onAdd }: FlashSalesProps) {
  const flashSales = useSelector(flashSalesRetriever);
  const [days, hours, minutes, seconds] = useCountdown("2025-12-31T23:59:59");
  const history = useHistory();

  const chooseProductHandler = (id: string) => {
    history.push(`/products/${id}`);
  };

  return (
    <Stack className="flash-sales-main" sx={{ padding: 0 }}>
      <Stack className="flash-sales-wrapper" flexDirection="column">
        {/* === TOP SECTION === */}
        <Stack className="flash-sales-top">
          <Stack
            className="sales-discount"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
          >
            {/* LEFT: TITLE + COUNTDOWN */}
            <Stack className="discount-left" flexDirection="column">
              <Stack
                className="discount-today"
                flexDirection="row"
                alignItems="center"
                gap={1}
              >
                <Box className="discount-red" />
                <Typography variant="body2">Today's</Typography>
              </Stack>

              <Stack
                className="discount-date-wrapper"
                flexDirection="row"
                alignItems="center"
                gap={3}
              >
                <Typography variant="h5" fontWeight={600}>
                  Flash Sales
                </Typography>

                <Stack
                  className="dynamic-wrapper"
                  flexDirection="row"
                  alignItems="center"
                  gap={1.5}
                >
                  {[
                    { label: "Days", value: days },
                    { label: "Hours", value: hours },
                    { label: "Minutes", value: minutes },
                    { label: "Seconds", value: seconds },
                  ].map((time, idx) => (
                    <React.Fragment key={time.label}>
                      <Stack className="dynamic-box" alignItems="center">
                        <span>{time.label}</span>
                        <p>{time.value}</p>
                      </Stack>
                      {idx < 3 && <Box className="equal">:</Box>}
                    </React.Fragment>
                  ))}
                </Stack>
              </Stack>
            </Stack>

            {/* RIGHT: ARROWS */}
            <Stack className="discount-right" flexDirection="row" gap={1}>
              <ArrowBackIcon
                sx={{
                  backgroundColor: "rgba(255,255,255,0.6)",
                  borderRadius: "50%",
                  cursor: "pointer",
                }}
              />
              <ArrowForwardIcon
                sx={{
                  backgroundColor: "rgba(255,255,255,0.6)",
                  borderRadius: "50%",
                  cursor: "pointer",
                }}
              />
            </Stack>
          </Stack>
        </Stack>

        {/* === BOTTOM: PRODUCTS === */}
        <Stack
          className="flash-sales-bottom"
          justifyContent="center"
          alignItems="center"
        >
          <Stack
            className="products-wrapper"
            flexDirection="row"
            flexWrap="wrap"
            justifyContent="center"
            gap={3}
          >
            {flashSales.length > 0 ? (
              flashSales.map((ele) => {
                const imagePath = ele.productImages?.length
                  ? `${serverApi}/${ele.productImages[0]}`
                  : "/productsImg/gamepad-2.png";

                return (
                  <Stack
                    key={ele._id}
                    className="product-box-main"
                    onClick={() => chooseProductHandler(ele._id)}
                  >
                    {/* DISCOUNT */}
                    <span className="discount-percentage">-40%</span>

                    {/* IMAGE */}
                    <img
                      className="product-images"
                      src={imagePath}
                      alt={ele.productName}
                    />

                    {/* LIKE + VIEW */}
                    <Stack
                      className="like-wiew"
                      flexDirection={"column"}
                      justifyContent="space-between"
                    >
                      <Badge
                        badgeContent={ele.productLikes}
                        sx={{
                          "& .MuiBadge-badge": {
                            backgroundColor: "#ff5500bf",
                            color: "#fff",
                          },
                        }}
                      >
                        <FavoriteBorderIcon className="like-view-icon" />
                      </Badge>

                      <Badge
                        badgeContent={ele.productViews}
                        sx={{
                          "& .MuiBadge-badge": {
                            backgroundColor: "#ff5500bf",
                            color: "#fff",
                          },
                        }}
                      >
                        <RemoveRedEyeOutlinedIcon className="like-view-icon" />
                      </Badge>
                    </Stack>

                    {/* PRODUCT NAME */}
                    <Typography
                      variant="h6"
                      component="h2"
                      className="productName"
                    >
                      {ele.productName}
                    </Typography>

                    {/* PRICE + BUTTON */}
                    <Stack
                      className="product-price"
                      flexDirection="row"
                      alignItems="center"
                      gap={2}
                    >
                      <Box className="exact-price">${ele.productPrice}</Box>
                      <Box className="discount-price">$144</Box>

                      <Typography
                        variant="h3"
                        component="h2"
                        className="sold-count"
                        sx={{ cursor: "pointer", marginLeft: "auto" }}
                        onClick={(e: React.MouseEvent<HTMLHeadingElement>) => {
                          e.stopPropagation();
                          onAdd({
                            _id: ele._id,
                            quantity: 1,
                            name: ele.productName,
                            price: ele.productPrice,
                            image: ele.productImages[0],
                          });
                        }}
                      >
                        PURCHASE
                      </Typography>
                    </Stack>
                  </Stack>
                );
              })
            ) : (
              <Typography className="no-products">No products found</Typography>
            )}
          </Stack>
        </Stack>

        {/* === VIEW ALL === */}
        <Stack
          className="view-all-products"
          justifyContent="center"
          alignItems="center"
          mt={3}
        >
          <NavLink className="view-all-butt" to="/products">
            View All Products
          </NavLink>
        </Stack>
      </Stack>
    </Stack>
  );
}
