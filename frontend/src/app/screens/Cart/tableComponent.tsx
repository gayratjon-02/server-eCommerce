import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Box,
  Typography,
  Pagination,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Close";
import { createSelector } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { retrievePausedOrders, retrieveSoldOrders } from "./selector";
import { serverApi } from "../../../lib/config";
import { CartItem } from "../../../lib/types/search";
import { removeItemFromPausedOrders, movePausedToSold } from "./slice";
import { useGlobals } from "../../hooks/useGlobals";

const pausedRetriever = createSelector(retrievePausedOrders, (paused) => ({
  paused,
}));
const soldRetriever = createSelector(retrieveSoldOrders, (sold) => ({ sold }));

const ITEMS_PER_PAGE = 5;

const toCartItems = (orders: any[]): CartItem[] =>
  (orders || []).flatMap((order: any) => {
    const { orderItems = [], productData = [] } = order;
    return (orderItems || []).map((item: any) => {
      const product = productData.find((p: any) => p._id === item.productId);
      const imagePath =
        product?.productImages?.[0] ||
        product?.mainImagePath ||
        product?.imagePath ||
        "/productsImg/default.png";
      return {
        _id: item._id,
        name: product?.productName || "Unknown Product",
        price: item.itemPrice ?? product?.productPrice ?? 0,
        quantity: item.itemQuantity ?? 1,
        image: `${serverApi}/${imagePath}`,
      } as CartItem;
    });
  });

const CartTable: React.FC = () => {
  const dispatch = useDispatch();
  const { authMember } = useGlobals();
  const userKey = authMember?._id || "guest";

  // LS kalitlari
  const tombKey = `deletedPausedItemIds_${userKey}`; // bitta-bitta o‘chirishlar
  const clearedKey = `pausedCleared_${userKey}`; // faqat timestamp sifatida
  const soldKey = `soldOrders_${userKey}`; // sotilgan buyurtmalar (Order[])
  const migratedKey = `migratedPausedItemIds_${userKey}`; // clear paytida ko‘chirilgan itemId’lar

  const { paused } = useSelector(pausedRetriever); // Order[]
  const { sold } = useSelector(soldRetriever); // Order[]

  const currentItems = React.useMemo<CartItem[]>(
    () => toCartItems(paused),
    [paused]
  );
  const soldItems = React.useMemo<CartItem[]>(() => toCartItems(sold), [sold]);

  // Pagination
  const [page, setPage] = React.useState(1);
  const [soldPage, setSoldPage] = React.useState(1);
  React.useEffect(() => setPage(1), [currentItems.length]);
  React.useEffect(() => setSoldPage(1), [soldItems.length]);

  const totalPages = Math.max(
    1,
    Math.ceil(currentItems.length / ITEMS_PER_PAGE)
  );
  const soldTotalPages = Math.max(
    1,
    Math.ceil(soldItems.length / ITEMS_PER_PAGE)
  );
  const shownCurrent = currentItems.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );
  const shownSold = soldItems.slice(
    (soldPage - 1) * ITEMS_PER_PAGE,
    soldPage * ITEMS_PER_PAGE
  );

  const getSubtotal = (price: number, qty: number) => price * qty;
  const totalPrice = currentItems.reduce(
    (acc, p) => acc + getSubtotal(p.price, p.quantity),
    0
  );

  const handleDelete = (product: CartItem) => {
    // Redux'dan o'chir
    dispatch(removeItemFromPausedOrders(product._id));
    // Tombstone LS'ga yoz (fetch paytida filter bo‘ladi)
    const arr = JSON.parse(localStorage.getItem(tombKey) || "[]");
    if (!arr.includes(product._id)) {
      arr.push(product._id);
      localStorage.setItem(tombKey, JSON.stringify(arr));
    }
  };

  // 🧹 CLEAR: paused → sold (Redux) + LS persist + migrated IDs
  const handleClearToSold = () => {
    // 1) LS: soldOrders to‘plamini append qilamiz (yangi yuqoriga)
    const prevSold: any[] = JSON.parse(localStorage.getItem(soldKey) || "[]");
    const nextSold = [...paused, ...prevSold];
    localStorage.setItem(soldKey, JSON.stringify(nextSold));

    // 2) LS: clear paytida ko‘chirilgan itemId’larni saqlaymiz
    const movedIds = paused.flatMap((ord: any) =>
      (ord.orderItems || []).map((it: any) => it._id)
    );
    const prevMoved: string[] = JSON.parse(
      localStorage.getItem(migratedKey) || "[]"
    );
    const mergedMoved = Array.from(new Set([...movedIds, ...prevMoved]));
    localStorage.setItem(migratedKey, JSON.stringify(mergedMoved));

    // 3) Faqat vaqt belgisi sifatida (bloklash YO‘Q)
    localStorage.setItem(clearedKey, String(Date.now()));
    // 4) Tombstone tozalash (ixtiyoriy)
    localStorage.removeItem(tombKey);

    // 5) Redux: ko‘chirish
    dispatch(movePausedToSold());
  };

  const renderRows = (rows: CartItem[], allowDelete: boolean) =>
    rows.length === 0 ? (
      <TableRow>
        <TableCell colSpan={4} align="center">
          <Typography color="text.secondary">No items.</Typography>
        </TableCell>
      </TableRow>
    ) : (
      rows.map((product) => (
        <TableRow
          key={product._id}
          sx={{
            "&:hover": {
              backgroundColor: "rgba(91,154,185,0.12)",
              transition: "0.3s",
            },
          }}
        >
          <TableCell>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                position: "relative",
                "&:hover .deleteBtn": { opacity: 1 },
              }}
            >
              <Box
                sx={{
                  width: 60,
                  height: 80,
                  borderRadius: 1,
                  position: "relative",
                  backgroundImage: `url(${product.image})`,
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}
              >
                {allowDelete && (
                  <IconButton
                    className="deleteBtn"
                    color="error"
                    size="small"
                    onClick={() => handleDelete(product)}
                    sx={{
                      position: "absolute",
                      top: -10,
                      right: -10,
                      bgcolor: "white",
                      opacity: 0,
                      transition: "opacity 0.3s",
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
              <Typography fontWeight={500}>{product.name}</Typography>
            </Box>
          </TableCell>
          <TableCell>${Number(product.price || 0).toFixed(2)}</TableCell>
          <TableCell>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                border: "1px solid #ccc",
                borderRadius: 1,
                width: "fit-content",
                px: 1,
              }}
            >
              <Typography sx={{ mx: 1, minWidth: 20, textAlign: "center" }}>
                {product.quantity}
              </Typography>
            </Box>
          </TableCell>
          <TableCell>
            ${getSubtotal(product.price || 0, product.quantity).toFixed(2)}
          </TableCell>
        </TableRow>
      ))
    );

  return (
    <Box sx={{ width: "100%", minHeight: "500px" }}>
      {/* CART (pausedOrders) */}
      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
        <Table>
          <TableHead
            sx={{ backgroundColor: "rgba(148,167,211,0.12)", height: "80px" }}
          >
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Product</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Price</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Quantity</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Subtotal</TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ backgroundColor: "rgba(148,190,211,0.05)" }}>
            {renderRows(shownCurrent, true)}
          </TableBody>
        </Table>
      </TableContainer>

      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, v) => setPage(v)}
            color="primary"
            shape="rounded"
          />
        </Box>
      )}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 3,
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleClearToSold}
          >
            PURCHASE
          </Button>
        </Box>
        <Typography
          variant="h6"
          sx={{
            mt: { xs: 2, md: 0 },
            fontWeight: "bold",
            color: "primary.main",
          }}
        >
          Total: ${Number(totalPrice || 0).toFixed(2)}
        </Typography>
      </Box>

      {/* SOLD (soldOrders) */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Sold items
        </Typography>

        <TableContainer
          component={Paper}
          sx={{ borderRadius: 3, boxShadow: 3 }}
        >
          <Table>
            <TableHead
              sx={{ backgroundColor: "rgba(148,167,211,0.12)", height: "70px" }}
            >
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Product</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Price</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Quantity</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Subtotal</TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ backgroundColor: "rgba(148,190,211,0.05)" }}>
              {renderRows(shownSold, false)}
            </TableBody>
          </Table>
        </TableContainer>

        {soldTotalPages > 1 && (
          <Box display="flex" justifyContent="center" mt={3}>
            <Pagination
              count={soldTotalPages}
              page={soldPage}
              onChange={(_, v) => setSoldPage(v)}
              color="primary"
              shape="rounded"
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CartTable;
