import { Badge, Box, Stack, Typography } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import { createSelector } from "@reduxjs/toolkit";
import { retrieveBestSellingProducts, retrieveFlashSales } from "./selector";
import { useSelector } from "react-redux";
import { serverApi } from "../../../lib/config";
import { CartItem } from "../../../lib/types/search";
import { NavLink, useHistory } from "react-router-dom";

/**  REDUX SELECTOR **/
const bestSellingProductsRetriever = createSelector(
  retrieveBestSellingProducts,
  (bestSellingProducts) => bestSellingProducts
);

interface BestSellingProductsProps {
  onAdd: (item: CartItem) => void;
}

export default function BestSellingProducts(props: BestSellingProductsProps) {
  const history = useHistory();

  const chooseProductHandler = (id: string) => {
    history.push(`/products/${id}`);
  };
  const bestSellingProducts = useSelector(bestSellingProductsRetriever);
  console.log("bestSellingProducts:", bestSellingProducts);
  const { onAdd } = props;

  return (
    <Stack className="best-selling-products-main">
      <Stack className="flash-sales-top">
        <Stack
          className="sales-discount"
          flexDirection={"row"}
          justifyContent={"space-between"}
        >
          <Stack className="discount-left" flexDirection={"column"}>
            <Stack
              className="discount-today"
              flexDirection={"row"}
              alignItems={"center"}
            >
              <div className="discount-red"></div>
              <span>This Month</span>
            </Stack>

            <Stack className="discount-date-wrapper" flexDirection={"row"}>
              <strong>Best Selling Products</strong>
            </Stack>
          </Stack>

          <Stack className="discount-right" flexDirection={"row"}>
            <NavLink to={"/products"} className="view-all">
              View All
            </NavLink>
          </Stack>
        </Stack>
      </Stack>

      {/* Test */}

      <Stack className="products-wrapper" flexDirection={"row"}>
        {bestSellingProducts.map((ele) => {
          const imagePath = ele.productImages?.length
            ? `${serverApi}/${ele.productImages[0]}`
            : "/productsImg/gamepad-2.png";

          return (
            <Stack
              key={ele._id}
              className="product-box-main"
              onClick={() => chooseProductHandler(ele._id)}
            >
              <span className="discount-percentage">-40%</span>
              <img className="product-images" src={imagePath} alt="image" />
              <Stack className="like-wiew" justifyContent={"space-between"}>
                <Badge
                  badgeContent={ele.productLikes}
                  sx={{
                    "& .MuiBadge-badge": {
                      backgroundColor: "#ff5500bf", // o‘zing xohlagan rang
                      color: "white", // matn rangi
                    },
                  }}
                >
                  <FavoriteBorderIcon className="like-view-icon" />
                </Badge>

                <Badge
                  badgeContent={ele.productViews}
                  sx={{
                    "& .MuiBadge-badge": {
                      backgroundColor: "#ff5500bf", // o‘zing xohlagan rang
                      color: "white", // matn rangi
                    },
                  }}
                >
                  <RemoveRedEyeOutlinedIcon className="like-view-icon" />
                </Badge>
              </Stack>

              <Typography variant="h6" component="h2" className="productName">
                {ele.productName}
              </Typography>

              <Stack className="product-price" flexDirection={"row"}>
                <Box className="exact-price">${ele.productPrice}</Box>
                <Box ml={2} className="discount-price">
                  {ele.productPrice + 134}
                </Box>
                <Typography
                  sx={{ cursor: "pointer" }}
                  variant="h3"
                  component={"h2"}
                  className="sold-count"
                  onClick={(e: React.MouseEvent<HTMLHeadingElement>) => {
                    onAdd({
                      _id: ele._id,
                      quantity: 1,
                      name: ele.productName,
                      price: ele.productPrice,
                      image: ele.productImages[0],
                    });
                    e.stopPropagation();
                  }}
                >
                  PURCHASE
                </Typography>
              </Stack>
            </Stack>
          );
        })}
      </Stack>
    </Stack>
  );
}
