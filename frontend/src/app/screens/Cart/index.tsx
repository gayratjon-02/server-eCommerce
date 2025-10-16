import { Breadcrumbs, Container, Stack } from "@mui/material";
import { NavLink } from "react-router-dom";
import CartTable from "./tableComponent";
import { useDispatch } from "react-redux";
import { createSelector, Dispatch } from "@reduxjs/toolkit";
import {
  setPausedOrders,
  setProcessOrders,
  setFinishedOrders,
  setSoldOrders,
} from "./slice";
import "../../../css/cart.css";
import { Order, OrderInquiry } from "../../../lib/types/order";
import { useEffect, useState } from "react";
import { OrderStatus } from "../../../lib/enums/order.enum";
import OrderService from "../../services/OrderService";
import { useGlobals } from "../../hooks/useGlobals";

const actionDispatch = (dispatch: Dispatch) => ({
  setPausedOrders: (data: Order[]) => dispatch(setPausedOrders(data)),
  setProcessOrders: (data: Order[]) => dispatch(setProcessOrders(data)),
  setFinishedOrders: (data: Order[]) => dispatch(setFinishedOrders(data)),
  setSoldOrders: (data: Order[]) => dispatch(setSoldOrders(data)),
});

function handleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
  event.preventDefault();
  console.info("You clicked a breadcrumb.");
}

export default function Cart() {
  const {
    setPausedOrders,
    setProcessOrders,
    setFinishedOrders,
    setSoldOrders,
  } = actionDispatch(useDispatch());
  const { authMember } = useGlobals();

  const [orderInquiry] = useState<OrderInquiry>({
    page: 1,
    limit: 5,
    orderStatus: OrderStatus.PAUSE,
  });

  // 🔑 LS kalitlari (userga bog‘lab)
  const userKey = authMember?._id || "guest";
  const tombKey = `deletedPausedItemIds_${userKey}`;
  const clearedKey = `pausedCleared_${userKey}`; // endi faqat timestamp sifatida
  const soldKey = `soldOrders_${userKey}`;
  const migratedKey = `migratedPausedItemIds_${userKey}`; // clear paytida ko‘chirilgan itemId’lar

  useEffect(() => {
    const order = new OrderService();

    // 1) SOLD’ni LSdan Redux'ga yuklash (refresh persist)
    try {
      const soldLocal: Order[] = JSON.parse(
        localStorage.getItem(soldKey) || "[]"
      );
      if (Array.isArray(soldLocal)) setSoldOrders(soldLocal);
    } catch {
      setSoldOrders([]);
    }

    // 2) PAUSE (doim fetch qilamiz) — migrated + tombstone bo‘yicha filter
    order
      .getMyOrders({ ...orderInquiry, orderStatus: OrderStatus.PAUSE })
      .then((data) => {
        const deletedIds: string[] = JSON.parse(
          localStorage.getItem(tombKey) || "[]"
        );
        const migratedIds: string[] = JSON.parse(
          localStorage.getItem(migratedKey) || "[]"
        );

        const filtered = (data || [])
          .map((ord: any) => ({
            ...ord,
            orderItems: (ord.orderItems || []).filter(
              (it: any) =>
                !deletedIds.includes(it._id) && !migratedIds.includes(it._id)
            ),
          }))
          .filter((ord: any) => (ord.orderItems || []).length > 0);

        setPausedOrders(filtered);
      })
      .catch((err) => console.log(err));

    // 3) PROCESS / FINISH odatdagidek
    order
      .getMyOrders({ ...orderInquiry, orderStatus: OrderStatus.PROCESS })
      .then((data) => setProcessOrders(data))
      .catch((err) => console.log(err));

    order
      .getMyOrders({ ...orderInquiry, orderStatus: OrderStatus.FINISH })
      .then((data) => setFinishedOrders(data))
      .catch((err) => console.log(err));
  }, [
    orderInquiry,
    userKey,
    tombKey,
    soldKey,
    migratedKey,
    clearedKey, // timestamp sifatida, mantiqqa ta’sir qilmaydi
    setPausedOrders,
    setProcessOrders,
    setFinishedOrders,
    setSoldOrders,
  ]);

  return (
    <Container className="cart-container">
      <Stack className="cart-main" height={"auto"}>
        <Stack className="cart-top">
          <div
            role="presentation"
            onClick={handleClick}
            className="product-table"
          >
            <Breadcrumbs aria-label="breadcrumb">
              <NavLink to={"/"}>Home</NavLink>
              <NavLink to={"/cart"} aria-current="page">
                Cart
              </NavLink>
            </Breadcrumbs>
          </div>
        </Stack>

        <Stack className="cart-wrapper">
          <CartTable />
          {/* Coupon/Total bloklarini olib tashlashing mumkin — endi ikki jadval yetarli */}
        </Stack>
      </Stack>
    </Container>
  );
}
