import React from "react";
import {
  Box,
  Container,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import { Link } from "react-router-dom";
import styled from "styled-components";
import SendIcon from "@mui/icons-material/Send";
import FacebookIcon from "@mui/icons-material/Facebook";

const Footers = styled.div`
  width: 100%;
  height: 590px;
  display: flex;
  background: #343434;
  background-size: cover;
`;

export default function Footer() {
  const authMember = null;

  return (
    <div className="footer">
      <Container className="footer-container">
        <Stack
          className="footer-wrapper"
          flexDirection={"row"}
          justifyContent={"space-between"}
        >
          <Stack
            className="exclusive-box"
            flexDirection={"column"}
            justifyContent={"space-between"}
          >
            <Box>
              <span>Exclusive</span>
            </Box>
            <Box>
              <div>Subscribe</div>
            </Box>
            <Box>
              <p>Get 10% off your first order</p>
            </Box>
            <Box>
              <TextField
                className="exclusive-inp"
                variant="standard"
                id="input-with-icon-textfield"
                placeholder="Enter your email"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <SendIcon className="send-icon" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>
          </Stack>
          <Stack
            sx={{ width: "180px" }}
            className="exclusive-box"
            flexDirection={"column"}
            justifyContent={"space-between"}
          >
            <Box>
              <span>Support</span>
            </Box>
            <Box>
              <p>111 Bijoy sarani, Dhaka, DH 1515, Bangladesh.</p>
            </Box>
            <Box>
              <p>exclusive@gmail.com</p>
              <p>+82-10-8336-2002</p>
            </Box>
          </Stack>

          <Stack
            sx={{ width: "180px", height: "auto" }}
            className="exclusive-box"
            flexDirection={"column"}
            justifyContent={"space-between"}
          >
            <Box>
              <span>Account</span>
            </Box>
            <Box>
              <p>My Account</p>
              <p>Login / Register</p>
              <p>Cart</p>
              <p>Wishlist</p>
              <p>Shop</p>
            </Box>
          </Stack>
          <Stack
            sx={{ width: "180px", height: "auto" }}
            className="exclusive-box"
            flexDirection={"column"}
            justifyContent={"space-between"}
          >
            <Box>
              <span>Quick Link</span>
            </Box>
            <Box>
              <p>Privacy Policy</p>
              <p>Terms Of Use</p>
              <p>FAQ</p>
              <p>Contact</p>
            </Box>
          </Stack>

          <Stack className="download-box">
            <Box>
              <span>Download App</span>
            </Box>

            <Box>
              <p>Save $3 with App New User Only</p>
            </Box>

            <Stack
              className="download-links"
              flexDirection={"row"}
              justifyContent={"space-between"}
              sx={{
                width: "198px",
                height: "84px",
              }}
            >
              <Box>
                <img
                  className="qr-code-img"
                  src="/icons/Qrcode.png"
                  alt="qrcode"
                />
              </Box>
              <Stack
                className="app-play-store"
                flexDirection={"column"}
                justifyContent={"space-between"}
              >
                <img
                  src="/icons/play-market.png"
                  className="play-market"
                  alt="play-market"
                />
                <img
                  src="/icons/app-store.png"
                  className="app-store"
                  alt="app-store"
                />
              </Stack>
            </Stack>

            <Stack
              className="social-links"
              flexDirection={"row"}
              justifyContent={"space-between"}
              sx={{ marginTop: "24px" }}
            >
              <img src="/icons/Icon-Facebook.svg" alt="" />
              <img src="/icons/Icon-Linkedin.svg" alt="" />
              <img src="/icons/instagram-icon.svg" alt="" />
              <img src="/icons/Icon-Linkedin.svg" alt="" />
            </Stack>
          </Stack>
        </Stack>
      </Container>
      <Stack className="footer-bott" flexDirection={"column"}>
        <div className="footerLine"></div>
        <Stack
          flexDirection={"row"}
          alignItems={"center"}
          justifyContent={"center"}
          className="copywrite-text-box"
        >
          <img src="icons/copywriter.svg" alt="copywriter" />
          <p>Copyright Rimel 2022. All right reserved</p>
        </Stack>
      </Stack>
    </div>
  );
}
