import { Badge, Box, Button, Container, Rating, Stack } from "@mui/material";

export default function NewArrivalProducts() {
  return (
    <Stack className="new-arrival-products-main">
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
              <span>Featured</span>
            </Stack>

            <Stack className="discount-date-wrapper" flexDirection={"row"}>
              <strong>Best Products</strong>
            </Stack>
          </Stack>
        </Stack>
      </Stack>

      <Stack
        className="arrival-wrapper"
        flexDirection={"row"}
        justifyContent={"space-between"}
      >
        <Stack
          className="arrival-left"
          justifyContent={"flex-end"}
          alignItems={"center"}
        >
          <Box
            className="left-img"
            sx={{
              backgroundImage: "url(/productsImg/17ProMax.png)",
            }}
          ></Box>
        </Stack>

        <Stack className="arrival-right">
          <Stack className="arrival-box-a" flexDirection={"row"}>
            <Stack className="box-text"></Stack>

            <Stack
              sx={{
                backgroundImage: "url(/productsImg/17ProMax.png)",
                backgroundSize: "cover",
              }}
              className="box-img"
            ></Stack>
          </Stack>

          <Stack
            className="arrival-box-b"
            flexDirection={"row"}
            justifyContent={"space-between"}
          >
            <Stack className="b-wrapper">
              <Stack
                className="b-left"
                sx={{
                  backgroundImage: "url(/productsImg/orange.png) ",
                }}
              ></Stack>
            </Stack>

            <Stack className="b-wrapper">
              <Stack
                className="b-left"
                sx={{
                  backgroundImage: "url(/productsImg/17Silver.png) ",
                }}
              ></Stack>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}
