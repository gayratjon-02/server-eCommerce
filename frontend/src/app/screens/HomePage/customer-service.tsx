import { Badge, Box, Button, Container, Rating, Stack } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { NavLink } from "react-router-dom";

export default function CustomerService() {
  return (
    <Stack
      className="customer-service-main"
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Stack
        className="service-wrapper"
        justifyContent={"space-between"}
        flexDirection={"row"}
      >
        <Stack
          className="service-box"
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <img src="/icons/icon-delivery.svg" alt="" />
          <p>FREE AND FAST DELIVERY</p>
          <span>Free delivery for all orders over $140</span>
        </Stack>

        <Stack
          className="service-box"
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <img src="/img/Icon-Customer service.svg" alt="" />
          <p>24/7 CUSTOMER SERVICE</p>
          <span>Friendly 24/7 customer support</span>
        </Stack>

        <Stack
          className="service-box"
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <img src="/icons/Icon-secure.png" alt="" />
          <p>MONEY BACK GUARANTEE</p>
          <span>We reurn money within 30 days</span>
        </Stack>
      </Stack>
    </Stack>
  );
}
