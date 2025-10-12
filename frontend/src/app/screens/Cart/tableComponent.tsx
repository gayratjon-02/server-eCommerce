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
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { createSelector } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { retrievePausedOrders } from "./selector";
import { serverApi } from "../../../lib/config";
import { CartItem } from "../../../lib/types/search";
import { Order } from "../../../lib/types/order";

interface CartTableProps {
  onAdd: (item: CartItem) => void;
  onRemove: (item: CartItem) => void;
  onDelete: (item: CartItem) => void;
  onDeleteAll: () => void;
}

const pausedOrdersRetriever = createSelector(
  retrievePausedOrders,
  (pausedOrders) => ({ pausedOrders })
);

const ITEMS_PER_PAGE = 5;

const CartTable: React.FC<CartTableProps> = ({
  onAdd,
  onRemove,
  onDelete,
  onDeleteAll,
}) => {
  const { pausedOrders } = useSelector(pausedOrdersRetriever);

  // 🔹 Reduxdan kelgan barcha productlarni tayyorlaymiz
  const allProducts = React.useMemo(() => {
    return pausedOrders.flatMap((order: any) => {
      const { orderItems = [], productData = [] } = order;

      return orderItems.map((item: any) => {
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
  }, [pausedOrders]);

  const [products, setProducts] = React.useState<CartItem[]>(allProducts);
  const [page, setPage] = React.useState(1);

  React.useEffect(() => {
    setProducts(allProducts);
  }, [allProducts]);

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const handleChangePage = (_: any, value: number) => setPage(value);

  const productsToShow = products.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  /** 🔹 Quantity o‘zgartirish */
  const handleQuantityChange = (product: CartItem, change: number) => {
    if (change > 0) {
      onAdd(product);
      setProducts((prev) =>
        prev.map((p) =>
          p._id === product._id ? { ...p, quantity: p.quantity + 1 } : p
        )
      );
    } else {
      onRemove(product);
      setProducts((prev) =>
        prev
          .map((p) =>
            p._id === product._id
              ? { ...p, quantity: Math.max(1, p.quantity - 1) }
              : p
          )
          .filter((p) => p.quantity > 0)
      );
    }
  };

  /** 🔹 Productni o‘chirish (❌ bosilganda) */
  const handleDelete = (product: CartItem) => {
    onDelete(product);
    setProducts((prev) => prev.filter((p) => p._id !== product._id));
  };

  /** 🔹 Cartni tozalash */
  const handleDeleteAll = () => {
    onDeleteAll();
    setProducts([]);
  };

  const getSubtotal = (price: number, qty: number) => price * qty;

  const totalPrice = products.reduce(
    (acc, p) => acc + getSubtotal(p.price, p.quantity),
    0
  );

  return (
    <Box sx={{ width: "100%", minHeight: "500px" }}>
      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
        <Table>
          <TableHead
            sx={{
              backgroundColor: "rgba(148, 167, 211, 0.12)",
              height: "80px",
            }}
          >
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Product</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Price</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Quantity</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Subtotal</TableCell>
            </TableRow>
          </TableHead>

          <TableBody
            sx={{
              backgroundColor: "rgba(148, 190, 211, 0.05)",
            }}
          >
            {productsToShow.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography color="text.secondary">
                    No items in your cart.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              productsToShow.map((product) => (
                <TableRow
                  key={product._id}
                  sx={{
                    "&:hover": {
                      backgroundColor: "rgba(91, 154, 185, 0.12)",
                      transition: "0.3s",
                    },
                  }}
                >
                  {/* 🔹 Product Image & Name */}
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
                          backgroundImage: `url(${product.image})`,
                          backgroundSize: "contain",
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "center",
                          borderRadius: 1,
                          position: "relative",
                        }}
                      >
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
                      </Box>
                      <Typography fontWeight={500}>{product.name}</Typography>
                    </Box>
                  </TableCell>

                  {/* 🔹 Price */}
                  <TableCell>
                    ${Number(product.price || 0).toFixed(2)}
                  </TableCell>

                  {/* 🔹 Quantity */}
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
                      <IconButton
                        size="small"
                        onClick={() => handleQuantityChange(product, -1)}
                      >
                        <RemoveIcon fontSize="small" />
                      </IconButton>
                      <Typography
                        sx={{ mx: 1, minWidth: 20, textAlign: "center" }}
                      >
                        {product.quantity}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleQuantityChange(product, 1)}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>

                  {/* 🔹 Subtotal */}
                  <TableCell>
                    $
                    {getSubtotal(product.price || 0, product.quantity).toFixed(
                      2
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 🔹 Pagination */}
      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handleChangePage}
            color="primary"
            shape="rounded"
          />
        </Box>
      )}

      {/* 🔹 Footer */}
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
          <Button variant="outlined" sx={{ mr: 2 }} onClick={handleDeleteAll}>
            Clear Cart
          </Button>
          <Button variant="contained" color="primary">
            Update Cart
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
    </Box>
  );
};

export default CartTable;
