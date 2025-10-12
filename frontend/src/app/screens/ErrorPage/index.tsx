import { Breadcrumbs, Container, Stack } from "@mui/material";
import { NavLink } from "react-router-dom";
import "../../../css/error.css"; 
import * as React from "react";
import Link from "@mui/material/Link";

export default function Error() {
  function handleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    event.preventDefault();
    console.info("You clicked a breadcrumb.");
  }
  return (
    <Container className="errorPage-container" sx={{ padding: "0" }}>
      <Stack className="errorPage">
        <Stack className="error-top">
          <div role="presentation" onClick={handleClick}>
            <Breadcrumbs aria-label="breadcrumb">
              <NavLink to={"/"} color="inherit" href="/">
                Home
              </NavLink>

              <NavLink
                to={"/errorPage"}
                color="text.primary"
                href="/contact"
                aria-current="page"
              >
                404 Error
              </NavLink>
            </Breadcrumbs>
          </div>
        </Stack>

        <Stack className="error-center">
          <Stack
            className="not-error"
            justifyContent={"center"}
            alignItems={"center"}
          >
            <strong>404 Not Found</strong>

            <p>Your visited page not found. You may go home page.</p>

            <NavLink to={"/"} className="error-btn">
              Back to Home page
            </NavLink>
          </Stack>
        </Stack>
      </Stack>
    </Container>
  );
}
