import { Box, Container, Stack } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useHistory } from "react-router-dom";
import { ProductCollection } from "../../../lib/enums/product.enum";

export default function CategoryList() {
  const history = useHistory();

  /**Handlers */
  const handleCategoryClick = (category: ProductCollection) => {
    history.push("/products", { category });
  };

  return (
    <Stack className="category-list-main">
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
              <span>Categories</span>
            </Stack>

            <Stack className="discount-date-wrapper" flexDirection={"row"}>
              <strong>Browse By Category</strong>
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

      <Stack className="catt-wrapper" flexDirection={"row"}>
        <Stack
          className="catt-box"
          flexDirection={"column"}
          alignItems={"center"}
          justifyContent={"center"}
          onClick={() => handleCategoryClick(ProductCollection.PHONE)}
        >
          <img
            width={"56px"}
            height={"56px"}
            src="/icons/Category-CellPhone.png"
            alt="Category-CellPhone.png"
          />
          <Box marginTop={"16px"}>Phones</Box>
        </Stack>

        <Stack
          className="catt-box"
          flexDirection={"column"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <img
            width={"56px"}
            height={"56px"}
            src="/icons/Category-Camera.png"
            alt="Category-CellPhone.png"
          />
          <Box marginTop={"16px"}>Camera</Box>
        </Stack>

        <Stack
          className="catt-box"
          flexDirection={"column"}
          alignItems={"center"}
          justifyContent={"center"}
          onClick={() => handleCategoryClick(ProductCollection.COMPUTER)}
        >
          <img
            width={"56px"}
            height={"56px"}
            src="/icons/Category-Computer.png"
            alt="Category-CellPhone.png"
          />
          <Box marginTop={"16px"}>Computer</Box>
        </Stack>

        <Stack
          className="catt-box"
          flexDirection={"column"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <img
            width={"56px"}
            height={"56px"}
            src="/icons/Category-Gamepad.png"
            alt="Category-CellPhone.png"
          />
          <Box marginTop={"16px"}>Games</Box>
        </Stack>

        <Stack
          className="catt-box"
          flexDirection={"column"}
          alignItems={"center"}
          justifyContent={"center"}
          onClick={() => handleCategoryClick(ProductCollection.PHONE)}
        >
          <img
            width={"56px"}
            height={"56px"}
            src="/icons/Category-CellPhone.png"
            alt="Category-CellPhone.png"
          />
          <Box marginTop={"16px"}>Phones</Box>
        </Stack>

        <Stack
          className="catt-box"
          flexDirection={"column"}
          alignItems={"center"}
          justifyContent={"center"}
          onClick={() => handleCategoryClick(ProductCollection.HEADPHONE)}
        >
          <img
            width={"56px"}
            height={"56px"}
            src="/icons/Category-Headphone.png"
            alt="Category-CellPhone.png"
          />
          <Box marginTop={"16px"}>AirPods</Box>
        </Stack>
      </Stack>
    </Stack>
  );
}
