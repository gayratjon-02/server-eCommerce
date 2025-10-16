import {
  Badge,
  Box,
  Button,
  Container,
  Rating,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { NavLink, useHistory } from "react-router-dom";
import { createSelector } from "@reduxjs/toolkit";
import { retrieveMixedProducts } from "./selector";
import { CartItem } from "../../../lib/types/search";
import { useDispatch, useSelector } from "react-redux";
import { serverApi } from "../../../lib/config";
import { useEffect, useRef } from "react";
import ProductService from "../../services/ProductService";
import { ProductCollection } from "../../../lib/enums/product.enum";
import { setMixedProducts } from "./slice";

/** === REDUX SELECTOR === */
const mixedProductsRetriever = createSelector(
  retrieveMixedProducts,
  (mixedProducts) => mixedProducts
);

interface FlashSalesProps {
  onAdd: (item: CartItem) => void;
}

export default function ExploreProducts(props: FlashSalesProps) {
  const { onAdd } = props;
  const history = useHistory();
  const dispatch = useDispatch();
  const mixedProducts = useSelector(mixedProductsRetriever);

  const chooseProductHandler = (id: string) => {
    history.push(`/products/${id}`);
  };

  useEffect(() => {
    // 🔒 React 18 StrictMode dev-da effect 2 marta ishlashini bloklaymiz
    const ranRef = { current: false } as { current: boolean };
    // Agar siz StrictMode’dasiz va effect ikki marta ishlayotgan bo‘lsa, quyidagi refni component scope’da saqlang:
    // const ranRef = useRef(false);
    // va pastda ranRef.current bilan tekshiring.

    if ((ranRef as any).current) return;
    (ranRef as any).current = true;

    const categories = Object.values(ProductCollection);
    const product = new ProductService();
    let isActive = true; // unmount bo‘lsa, state set qilmaymiz

    // ——— Helpers ———
    const shuffle = <T,>(arr: T[]): T[] => {
      const a = [...arr];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    };

    const sampleUnique = <T,>(arr: T[], n: number): T[] => {
      const uniq = Array.from(new Set(arr));
      return shuffle(uniq).slice(0, n);
    };

    const fetchExactly8 = async () => {
      try {
        // 1) Random 4 ta kategoriya tanlaymiz
        const pickedCategories = sampleUnique(
          categories,
          Math.min(4, categories.length)
        );

        // 2) Har bir kategoriyadan 2 tadan product
        const perCategoryResponses = await Promise.all(
          pickedCategories.map((cat) =>
            product.getProducts({
              page: 1,
              limit: 2,
              order: "createdAt",
              productCollection: cat,
              search: "",
            })
          )
        );

        // 3) Flatten + dublikatlarni yo‘qotish
        const allFetched = perCategoryResponses.flat().filter(Boolean);
        const byId = new Map<string, any>();
        for (const p of allFetched) {
          if (p && p._id && !byId.has(p._id)) byId.set(p._id, p);
        }
        let unique: any[] = Array.from(byId.values());

        // 4) Agar 8 tadan kam bo‘lsa — umumiy bazadan to‘ldiramiz
        if (unique.length < 8) {
          const need = 8 - unique.length;
          const filler = await product.getProducts({
            page: 1,
            limit: need * 3, // yetarli bo‘lishi uchun biroz ko‘proq
            order: "createdAt",
            search: "",
          });

          for (const p of filler) {
            if (p && p._id && !byId.has(p._id)) {
              byId.set(p._id, p);
              unique.push(p);
              if (unique.length >= 8) break;
            }
          }
        }

        // 5) Tasodifiy tartib + aniq 8 ta
        unique = shuffle(unique).slice(0, 8);

        if (isActive) {
          dispatch(setMixedProducts(unique));
        }
      } catch (error) {
        console.error(" Error fetching random products:", error);
        if (isActive) dispatch(setMixedProducts([]));
      }
    };

    fetchExactly8();

    return () => {
      isActive = false; // cleanup
    };
  }, [dispatch]); // ❗ qayta renderda fetch bo‘lmasligi uchun faqat dispatch

  return (
    <Stack className="explore-products-main">
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
              <span>Our Products</span>
            </Stack>

            <Stack className="discount-date-wrapper" flexDirection={"row"}>
              <strong>Random Products</strong>
            </Stack>
          </Stack>

          <Stack className="discount-right" flexDirection={"row"}>
            <ArrowBackIcon
              sx={{
                backgroundColor: " rgba(255, 255, 255, 0.619)",
                borderRadius: "50%",
              }}
            />
            <ArrowForwardIcon
              sx={{
                backgroundColor: " rgba(255, 255, 255, 0.619)",
                borderRadius: "50%",
              }}
            />
          </Stack>
        </Stack>
      </Stack>

      <div className="explore-products-wrapper">
        <Stack
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 3,
            justifyItems: "start",
          }}
          className="products-wrapper"
          gap={3}
        >
          {mixedProducts.length > 0 ? (
            mixedProducts.map((ele) => {
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

                  <img
                    className="product-images"
                    src={imagePath}
                    alt={ele.productName}
                  />

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

                  <Typography
                    variant="h6"
                    component="h2"
                    className="productName"
                  >
                    {ele.productName}
                  </Typography>

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
      </div>

      <Stack
        className="view-all-products"
        justifyContent={"center"}
        alignItems={"center"}
      >
        <NavLink className={"view-all-butt"} to="/products">
          View All Products
        </NavLink>
      </Stack>
    </Stack>
  );
}
