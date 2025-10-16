import React, { useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { setBestSellingProducts, setFlashSales } from "./slice";
import { Product } from "../../../lib/types/product";
import ProductService from "../../services/ProductService";
import { ProductCollection } from "../../../lib/enums/product.enum";
import { Container, Typography } from "@mui/material";
import Divider from "../../components/divider";
import CategoryMain from "./category-main";
import FlashSales from "./flash-sales";
import CategoryList from "./category-list";
import BestSellingProducts from "./best-selling-products";
import Advertaisment from "./advertaisment";
import ExploreProducts from "./explore-products";
import NewArrivalProducts from "./new-arrival-products";
import CustomerService from "./customer-service";
import { CartItem } from "../../../lib/types/search";
import "../../../css/home.css";

/**  REDUX SLICE DISPATCH **/
const actionDispatch = (dispatch: Dispatch) => ({
  setFlashSales: (data: Product[]) => dispatch(setFlashSales(data)),
  setBestSellingProducts: (data: Product[]) =>
    dispatch(setBestSellingProducts(data)),
});

interface HomePageProps {
  onAdd: (item: CartItem) => void;
  onRemove: (item: CartItem) => void;
  onDelete: (item: CartItem) => void;
  onDeleteAll: () => void;
}

export default function HomePage(props: HomePageProps) {
  const dispatch = useDispatch();
  const { onAdd, onRemove, onDelete, onDeleteAll } = props;

  /** ✅ Memoize qilamiz — har renderda yangidan yaratilmasin */
  const { setFlashSales, setBestSellingProducts } = useMemo(
    () => actionDispatch(dispatch),
    [dispatch]
  );

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const product = new ProductService();

        const [latest, bestSelling] = await Promise.all([
          product.getProducts({
            page: 1,
            limit: 4,
            order: "latest",
            productCollection: ProductCollection.PHONE,
          }),
          product.getProducts({
            page: 1,
            limit: 4,
            order: "bySold",
            productCollection: ProductCollection.PHONE,
          }),
        ]);

        setFlashSales(latest);
        setBestSellingProducts(bestSelling);
      } catch (err) {
        console.error("Product fetch error:", err);
      }
    };

    fetchProducts();
  }, [setFlashSales, setBestSellingProducts]); // ✅ endi bu funksiya doim barqaror

  return (
    <div className="home-page">
      <Container className="home-container">
        <CategoryMain />
        <FlashSales onAdd={onAdd} />
        <Divider width="2" height="1" bg="#d9d9d9" />
        <CategoryList />
        <Divider width="2" height="1" bg="#d9d9d9" />
        <BestSellingProducts onAdd={onAdd} />
        <Advertaisment />
        <ExploreProducts onAdd={onAdd} />
        <NewArrivalProducts />
        <CustomerService />
      </Container>
    </div>
  );
}
