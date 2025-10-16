import React, { useEffect, useState } from "react";
import {
  Route,
  Switch,
  useHistory,
  useLocation,
  useRouteMatch,
} from "react-router-dom";
import Detail from "./detail";
import {
  Stack,
  InputBase,
  Select,
  MenuItem,
  Typography,
  Box,
  Badge,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useSelector, useDispatch } from "react-redux";
import { serverApi } from "../../../lib/config";
import { CartItem } from "../../../lib/types/search";
import ProductService from "../../services/ProductService";
import { ProductCollection } from "../../../lib/enums/product.enum";
import { setProducts } from "./slice";
import { Product } from "../../../lib/types/product";
import { createSelector, Dispatch } from "@reduxjs/toolkit";
import { retrieveProducts } from "./selector";

/** REDUX SLICE & SELECTOR **/
const actionDispatch = (dispatch: Dispatch) => ({
  setProducts: (data: Product[]) => dispatch(setProducts(data)),
});

const productsretriever = createSelector(retrieveProducts, (products) => ({
  products,
}));

interface ProductsPageProps {
  onAdd: (item: CartItem) => void;
  onRemove: (item: CartItem) => void;
  onDelete: (item: CartItem) => void;
  onDeleteAll: () => void;
}
interface LocationState {
  category?: ProductCollection;
}

export default function ProductsPage({ onAdd }: ProductsPageProps) {
  // MINE
  const location = useLocation<LocationState>();
  const initialCategory =
    (location.state?.category as ProductCollection) || ProductCollection.PHONE;

  const { setProducts } = actionDispatch(useDispatch());
  const { products } = useSelector(productsretriever);
  const history = useHistory();

  /** 🔹 Local States */
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<ProductCollection>(initialCategory);
  const [selectedPriceRange, setSelectedPriceRange] = useState("All");
  const [sortOption, setSortOption] = useState("Popular");
  const { path } = useRouteMatch();

  useEffect(() => {
    const product = new ProductService();
    product
      .getProducts({
        page: 1,
        limit: 8,
        order: "createdAt",
        productCollection: selectedCategory,
        search: "",
      })
      .then((data) => setProducts(data))
      .catch((err) => console.log(err));
  }, [selectedCategory]);

  const filteredProducts = products
    ?.filter((product) =>
      product.productName
        ?.toLowerCase()
        .includes(searchTerm.trim().toLowerCase())
    )
    ?.filter((product) => {
      const price = product.productPrice;
      switch (selectedPriceRange) {
        case "Under2000":
          return price < 2000;
        case "1000-1800":
          return price >= 1000 && price <= 1800;
        case "700-999":
          return price >= 700 && price <= 999;
        case "400-699":
          return price >= 400 && price <= 699;
        case "Above399":
          return price > 399;
        default:
          return true;
      }
    })
    ?.sort((a, b) => {
      switch (sortOption) {
        case "Popular":
          return (b.productViews ?? 0) - (a.productViews ?? 0);
        case "Newest":
          return (
            new Date(b.createdAt ?? "").getTime() -
            new Date(a.createdAt ?? "").getTime()
          );
        case "MostLiked":
          return (b.productLikes ?? 0) - (a.productLikes ?? 0);
        default:
          return 0;
      }
    });

  // HANDLERS
  const chooseProductHandler = (id: string) => {
    history.push(`/products/${id}`);
  };

  /** ========================= RETURN ========================= */
  return (
    <div className="products-page">
      <Switch>
        <Route path={`${path}/:productId`}>
          <Detail onAdd={onAdd} />
        </Route>

        <Route exact path={path}>
          <div className="product-main">
            <Stack className="product-main-wrapper" flexDirection="row">
              {/* === LEFT PANEL (FILTERS) === */}
              <Stack className="sorting-wrapper">
                <Stack className="filter-box">
                  {/* CATEGORY */}
                  <div className="filter-section">
                    <h4 className="filter-title">CATEGORY</h4>
                    <div className="filter-options">
                      {["COMPUTER", "PHONE", "HEADPHONE", "WATCH", "OTHER"].map(
                        (cat) => (
                          <label key={cat}>
                            <input
                              type="radio"
                              name="category"
                              value={cat}
                              checked={selectedCategory === cat}
                              onChange={(e) =>
                                setSelectedCategory(
                                  e.target.value as ProductCollection
                                )
                              }
                            />{" "}
                            {cat}
                          </label>
                        )
                      )}
                    </div>
                  </div>

                  {/* PRICE RANGE */}
                  <div className="filter-section">
                    <h4 className="filter-title">PRICE RANGE</h4>
                    <div className="slider-box">
                      <input type="range" min="0" max="100" defaultValue="20" />
                    </div>

                    <div className="price-inputs">
                      <input type="text" placeholder="Min price" />
                      <input type="text" placeholder="Max price" />
                    </div>

                    <div className="filter-options">
                      {[
                        { value: "All", label: "All Price" },
                        { value: "Under2000", label: "Under $2000" },
                        { value: "1000-1800", label: "$1000 - $1800" },
                        { value: "700-999", label: "$700 - $999" },
                        { value: "400-699", label: "$400 - $699" },
                        { value: "Above399", label: "Above $399" },
                      ].map((range) => (
                        <label key={range.value}>
                          <input
                            type="radio"
                            name="price"
                            value={range.value}
                            checked={selectedPriceRange === range.value}
                            onChange={(e) =>
                              setSelectedPriceRange(e.target.value)
                            }
                          />{" "}
                          {range.label}
                        </label>
                      ))}
                    </div>
                  </div>
                </Stack>
              </Stack>

              {/* === MIDDLE PANEL (PRODUCT LIST) === */}
              <Stack className="main-middle" flexDirection="column">
                {/* SEARCH & SORT BAR */}
                <Stack className="product-content-top">
                  <div className="product-toolbar">
                    <div className="search-box">
                      <SearchIcon className="search-icon" />
                      <InputBase
                        placeholder="Search..."
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>

                    <div className="sort-box">
                      <Typography className="sort-label">Sort By:</Typography>
                      <Select
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        className="sort-select"
                      >
                        <MenuItem value="Popular">Popular</MenuItem>
                        <MenuItem value="Newest">Newest</MenuItem>
                        <MenuItem value="MostLiked">Most Liked</MenuItem>
                      </Select>
                    </div>

                    <Typography className="results-text">
                      Result: {filteredProducts?.length || 0}
                    </Typography>
                  </div>
                </Stack>

                {/* PRODUCT LIST */}
                <Stack className="product-content-middle">
                  <Stack
                    className="products-wrapper"
                    flexDirection="row"
                    flexWrap="wrap"
                    gap={3}
                  >
                    {filteredProducts && filteredProducts.length > 0 ? (
                      filteredProducts.map((ele) => {
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
                              justifyContent="space-between"
                            >
                              <Badge
                                badgeContent={ele.productLikes}
                                sx={{
                                  "& .MuiBadge-badge": {
                                    backgroundColor: "#ff5500bf",
                                    color: "white",
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
                                    color: "white",
                                  },
                                }}
                              >
                                <RemoveRedEyeOutlinedIcon className="like-view-icon" />
                              </Badge>
                            </Stack>

                            <Typography variant="h6" className="productName">
                              {ele.productName}
                            </Typography>

                            <Stack
                              className="product-price"
                              flexDirection="row"
                              alignItems="center"
                            >
                              <Box className="exact-price">
                                ${ele.productPrice}
                              </Box>
                              <Box ml={2} className="discount-price">
                                $144
                              </Box>

                              <Typography
                                sx={{ cursor: "pointer", marginLeft: "auto" }}
                                variant="h3"
                                className="sold-count"
                                onClick={(
                                  e: React.MouseEvent<HTMLHeadingElement>
                                ) => {
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
                      })
                    ) : (
                      <Typography className="no-products">
                        No products found
                      </Typography>
                    )}
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
          </div>
        </Route>
      </Switch>
    </div>
  );
}
