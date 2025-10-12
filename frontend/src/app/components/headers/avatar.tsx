import React, { useState } from "react";
import {
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Typography,
  Box,
  Tooltip,
} from "@mui/material";

import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import MemberService from "../../services/MemberService";
import {
  sweetErrorHandling,
  sweetTopSuccessAlert,
} from "../../../lib/sweetAlert";
import { Messages } from "../../../lib/config";
import { useGlobals } from "../../hooks/useGlobals";
import { useHistory } from "react-router-dom";

export default function AccountMenu() {
  const { setAuthMember } = useGlobals();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const history = useHistory();
  //** Handlers **/

  const pushToCart = () => {
    history.push("/cart");
  };

  const pushToAccount = () => {
    history.push("/account");
  };

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLogoutRequest = async () => {
    try {
      const member = new MemberService();
      await member.logout();

      await sweetTopSuccessAlert("success", 700);
      setAuthMember(null);
    } catch (err) {
      console.log(err);
      sweetErrorHandling(Messages.error1);
    }
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <Tooltip title="My Account">
        <IconButton onClick={handleOpen} sx={{ p: 0 }}>
          <Avatar
            sx={{
              bgcolor: "#DB4444",
              marginLeft: "10px",
              width: "32px",
              height: "32px",
            }}
          >
            <AccountCircleOutlinedIcon />
          </Avatar>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        PaperProps={{
          sx: {
            background: "linear-gradient(180deg, #8e8e8e 0%, #522b52 100%)",
            color: "white",
            borderRadius: "12px",
            minWidth: 240,
            p: 0.5,
          },
        }}
      >
        <MenuItem
          onClick={() => {
            handleClose();
            pushToAccount();
          }}
        >
          <ListItemIcon sx={{ color: "white" }}>
            <AccountCircleOutlinedIcon />
          </ListItemIcon>
          <Typography>Manage My Account</Typography>
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleClose();
            pushToCart();
          }}
        >
          <ListItemIcon sx={{ color: "white" }}>
            <ShoppingBagOutlinedIcon />
          </ListItemIcon>
          <Typography>My Order</Typography>
        </MenuItem>

        <MenuItem onClick={handleClose}>
          <ListItemIcon sx={{ color: "white" }}>
            <CancelOutlinedIcon />
          </ListItemIcon>
          <Typography>My Cancellations</Typography>
        </MenuItem>

        <MenuItem onClick={handleClose}>
          <ListItemIcon sx={{ color: "white" }}>
            <StarBorderOutlinedIcon />
          </ListItemIcon>
          <Typography>My Reviews</Typography>
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleClose();
            handleLogoutRequest();
          }}
        >
          <ListItemIcon sx={{ color: "white" }}>
            <LogoutOutlinedIcon />
          </ListItemIcon>
          <Typography>Logout</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
}
