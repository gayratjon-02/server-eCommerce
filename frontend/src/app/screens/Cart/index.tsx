import { Breadcrumbs, Button, Container, Stack, Table } from "@mui/material";
import { NavLink } from "react-router-dom";
import CartTable from "./tableComponent";
import { useDispatch, useSelector } from "react-redux";
import { createSelector, Dispatch } from "@reduxjs/toolkit";
import { setPausedOrders, setProcessOrders, setFinishedOrders } from "./slice";
import "../../../css/cart.css";
import { Order } from "../../../lib/types/order";
import { OrderInquiry } from "../../../lib/types/order";
import { useEffect, useState } from "react";
import { OrderStatus } from "../../../lib/enums/order.enum";
import OrderService from "../../services/OrderService";
import { retrievePausedOrders } from "./selector";
import { CartItem } from "../../../lib/types/search";

/**  REDUX SLICE DISPATCH **/
const actionDispatch = (dispatch: Dispatch) => ({
  setPausedOrders: (data: Order[]) => dispatch(setPausedOrders(data)),
  setProcessOrders: (data: Order[]) => dispatch(setProcessOrders(data)),
  setFinishedOrders: (data: Order[]) => dispatch(setFinishedOrders(data)),
});

const pausedOrdersRetriever = createSelector(
  retrievePausedOrders,
  (pausedOrders) => ({ pausedOrders })
);

function handleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
  event.preventDefault();
  console.info("You clicked a breadcrumb.");
}

interface ProductsPageProps {
  onAdd: (item: CartItem) => void;
  onRemove: (item: CartItem) => void;
  onDelete: (item: CartItem) => void;
  onDeleteAll: () => void;
}

export default function Cart({
  onAdd,
  onDelete,
  onDeleteAll,
  onRemove,
}: ProductsPageProps) {
  const { setPausedOrders, setProcessOrders, setFinishedOrders } =
    actionDispatch(useDispatch());

  const { pausedOrders } = useSelector(pausedOrdersRetriever);

  const [orderInquiry, setPrderInquiry] = useState<OrderInquiry>({
    page: 1,
    limit: 5,
    orderStatus: OrderStatus.PAUSE,
  });

  useEffect(() => {
    const order = new OrderService();

    order
      .getMyOrders({ ...orderInquiry, orderStatus: OrderStatus.PAUSE })
      .then((data) => setPausedOrders(data))
      .catch((err) => console.log(err));

    order
      .getMyOrders({ ...orderInquiry, orderStatus: OrderStatus.PROCESS })
      .then((data) => setProcessOrders(data))
      .catch((err) => console.log(err));

    order
      .getMyOrders({ ...orderInquiry, orderStatus: OrderStatus.FINISH })
      .then((data) => setFinishedOrders(data))
      .catch((err) => console.log(err));
  }, [orderInquiry]);

  return (
    <Container className="cart-container">
      <Stack className="cart-main">
        <Stack className="cart-top">
          <div
            role="presentation"
            onClick={handleClick}
            className="product-table"
          >
            <Breadcrumbs aria-label="breadcrumb">
              <NavLink to={"/"} color="inherit" href="/">
                Home
              </NavLink>

              <NavLink
                to={"/cart"}
                color="text.primary"
                href="/contact"
                aria-current="page"
              >
                Cart
              </NavLink>
            </Breadcrumbs>
          </div>
        </Stack>

        <Stack className="cart-wrapper">
          <CartTable
            onAdd={onAdd}
            onRemove={onRemove}
            onDelete={onDelete}
            onDeleteAll={onDeleteAll}
          />

          <Stack
            className="coupon-total"
            flexDirection={"row"}
            justifyContent={"space-between"}
          >
            <Stack className="cart-coupon">
              <Stack className="coupon-code" flexDirection={"row"}>
                <input type="text" placeholder="Coupon Code" />
                <Button className="coupon-btn">Apply Coupon</Button>
              </Stack>
            </Stack>
            <Stack className="cart-total">
              <p>Cart Total</p>

              <Stack
                className="cart-detail"
                flexDirection={"row"}
                justifyContent={"space-between"}
              >
                <span>Subtotal</span>
                <strong>$1750</strong>
              </Stack>

              <Stack
                className="cart-detail"
                flexDirection={"row"}
                justifyContent={"space-between"}
              >
                <span>Shopping</span>
                <strong>Free</strong>
              </Stack>

              <Stack
                className="cart-detail"
                flexDirection={"row"}
                justifyContent={"space-between"}
              >
                <span>Total</span>
                <strong>$1750</strong>
              </Stack>

              <Stack
                width={"100"}
                mt={"20px"}
                justifyContent={"center"}
                alignItems={"center"}
                className="card-butt"
              >
                <Button className="card-butt2">Process to checkout</Button>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Container>
  );
}
