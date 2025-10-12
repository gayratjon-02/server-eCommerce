import React, { ChangeEvent, useEffect, useRef } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  alpha,
  useTheme,
  Link as MUILink,
} from "@mui/material";
import { NavLink, useHistory } from "react-router-dom";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import SearchIcon from "@mui/icons-material/Search";

import { createSelector, Dispatch } from "@reduxjs/toolkit";
import { retrieveMember } from "./selector";
import { Member, MemberUpdateInput } from "../../../lib/types/member";
import { setMember } from "./slice";
import { useDispatch, useSelector } from "react-redux";
import MemberService from "../../services/MemberService";
import {
  sweetErrorHandling,
  sweetTopSuccessAlert,
} from "../../../lib/sweetAlert";

/**  REDUX SLICE DISPATCH **/
const actionDispatch = (dispatch: Dispatch) => ({
  setMember: (data: Member) => dispatch(setMember(data)),
});

const MemberRetriever = createSelector(retrieveMember, (AccountPage) => ({
  AccountPage,
}));

function SideLink({
  to,
  icon,
  label,
  active = false,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <NavLink to={to} style={{ textDecoration: "none" }}>
      <Stack
        direction="row"
        alignItems="center"
        spacing={1.5}
        sx={(t) => ({
          px: 1.25,
          py: 1,
          borderRadius: 2,
          color: active ? t.palette.primary.main : t.palette.text.secondary,
          bgcolor: active
            ? alpha(t.palette.primary.main, 0.08)
            : alpha(t.palette.common.white, 0.06),
          transition: "all .2s ease",
          "&:hover": {
            transform: "translateY(-1px)",
            bgcolor: active
              ? alpha(t.palette.primary.main, 0.14)
              : alpha(t.palette.text.primary, 0.06),
          },
        })}
      >
        <Box sx={{ display: "grid", placeItems: "center" }}>{icon}</Box>
        <Typography fontSize={14} fontWeight={600}>
          {label}
        </Typography>
      </Stack>
    </NavLink>
  );
}

function SectionCard({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <Box
      sx={(t) => ({
        p: { xs: 2.5, sm: 3 },
        borderRadius: 3,
        bgcolor: alpha(t.palette.background.paper, 0.7),
        backdropFilter: "blur(10px)",
        border: `1px solid ${alpha(t.palette.divider, 0.4)}`,
        boxShadow:
          "0 10px 25px rgba(0,0,0,.06), inset 0 1px 0 rgba(255,255,255,.06)",
      })}
    >
      <Typography
        variant="h6"
        fontWeight={800}
        sx={(t) => ({
          mb: 2.5,
          letterSpacing: 0.2,
          color: t.palette.text.primary,
        })}
      >
        {title}
      </Typography>
      {children}
    </Box>
  );
}

export default function AccountScreen() {
  const { AccountPage } = useSelector(MemberRetriever);
  const { setMember } = actionDispatch(useDispatch());
  const t = useTheme();
  const history = useHistory();

  const pushToHome = () => {
    history.push("/");
  };

  // PROFILE + PASSWORD form state (controlled)
  const [profileForm, setProfileForm] = React.useState<MemberUpdateInput>({
    memberNick: "",
    memberPhone: "",
    memberAddress: "",
    memberDesc: "",
    memberImage: "",
  });
  const [passwordForm, setPasswordForm] = React.useState<MemberUpdateInput>({
    memberPassword: "",
    memberNewPassword: "",
    memberConfirmPassword: "",
  });

  // 1) Ma'lumotni faqat **bir marta** olib kelamiz (loop bo'lmaydi)
  useEffect(() => {
    const svc = new MemberService();
    svc
      .getMemberDetail()
      .then((data) => setMember(data))
      .catch(console.log);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // <- bo'sh dependency

  // 2) Redux'dan kelgan userni formga **bir marta** yozib qo'yamiz
  const filledOnceRef = useRef(false);
  useEffect(() => {
    if (!AccountPage || filledOnceRef.current) return;
    setProfileForm({
      memberNick: AccountPage.memberNick ?? "",
      memberPhone: AccountPage.memberPhone ?? "",
      memberAddress: AccountPage.memberAddress ?? "",
      memberDesc: AccountPage.memberDesc ?? "",
      memberImage: AccountPage.memberImage ?? "",
    });
    filledOnceRef.current = true;
  }, [AccountPage]);

  // 3) Save — faqat to'ldirilgan fieldlarni yuboradi.
  const handleSave = async () => {
    try {
      if (!profileForm.memberNick?.trim())
        return sweetErrorHandling("Nickname required");
      if (!profileForm.memberPhone?.trim())
        return sweetErrorHandling("Phone required");

      const needPwd =
        !!passwordForm.memberPassword?.trim() &&
        !!passwordForm.memberNewPassword?.trim() &&
        !!passwordForm.memberConfirmPassword?.trim();

      const payload: MemberUpdateInput = {
        ...profileForm,
        ...(needPwd
          ? {
              memberPassword: passwordForm.memberPassword,
              memberNewPassword: passwordForm.memberNewPassword,
              memberConfirmPassword: passwordForm.memberConfirmPassword,
            }
          : {}),
      };

      const svc = new MemberService();
      const updated = await svc.updateMember(payload);

      setMember(updated);
      localStorage.setItem("memberData", JSON.stringify(updated));
      sweetTopSuccessAlert("Password Updated");

      setPasswordForm({
        memberPassword: "",
        memberNewPassword: "",
        memberConfirmPassword: "",
      });
    } catch (err: any) {
      sweetErrorHandling(err?.response?.data?.message);
    }
  };

  // profile inputlar uchun
  const onProfileInput =
    <K extends keyof MemberUpdateInput>(key: K) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      setProfileForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

  // parol inputlari uchun
  type PwdKeys =
    | "memberPassword"
    | "memberNewPassword"
    | "memberConfirmPassword";
  const onPasswordInput =
    (key: PwdKeys) => (e: ChangeEvent<HTMLInputElement>) => {
      setPasswordForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

  return (
    <Box
      sx={{
        background:
          "linear-gradient(180deg, #f6f7fb 0%, #f4f6fa 40%, #f9fafc 100%)",
      }}
    >
      <Container sx={{ py: { xs: 3, md: 6 } }}>
        {/* ---- Breadcrumb + Welcome ---- */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Stack direction="row" spacing={1.25} alignItems="center">
            <HomeOutlinedIcon sx={{ fontSize: 18, color: "text.secondary" }} />
            <Typography
              sx={{ cursor: "pointer" }}
              variant="body2"
              color="text.secondary"
              onClick={() => pushToHome()}
            >
              Home
            </Typography>
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                bgcolor: "divider",
                mx: 0.5,
              }}
            />
            <Typography variant="body2" fontWeight={700}>
              My Account
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1.25} alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Welcome!
            </Typography>
            <Chip
              label={AccountPage?.memberNick}
              size="small"
              sx={{
                fontWeight: 700,
                bgcolor: alpha(t.palette.primary.main, 0.08),
                color: t.palette.primary.main,
              }}
            />
          </Stack>
        </Stack>

        <Stack direction={{ xs: "column", lg: "row" }} spacing={3}>
          {/* ---- LEFT ---- */}
          <Box
            sx={{
              width: { xs: "100%", lg: 300 },
              position: "relative",
              borderRadius: 3,
              p: 2.25,
              background:
                "linear-gradient(180deg, rgba(219,68,68,0.12) 0%, rgba(255,255,255,0.65) 60%)",
              border: `1px solid ${alpha(t.palette.primary.main, 0.2)}`,
              boxShadow: "0 12px 30px rgba(219,68,68,.08)",
              overflow: "hidden",
            }}
          >
            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <Avatar
                sx={{
                  width: 46,
                  height: 46,
                  bgcolor: t.palette.primary.main,
                  boxShadow: "0 8px 18px rgba(219,68,68,.25)",
                }}
              >
                <PersonOutlineIcon />
              </Avatar>
              <Box>
                <Typography fontWeight={800}>
                  {AccountPage?.memberNick}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {AccountPage?.memberPhone}
                </Typography>
              </Box>
            </Stack>

            <TextField
              fullWidth
              size="small"
              placeholder="Search settings"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 2.25,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  bgcolor: alpha("#fff", 0.8),
                },
              }}
            />

            <Typography
              variant="overline"
              sx={{
                color: "text.secondary",
                letterSpacing: 1,
                mb: 1,
                display: "block",
              }}
            >
              Manage My Account
            </Typography>
            <Stack spacing={1}>
              <SideLink
                to="/account/profile"
                icon={<PersonOutlineIcon />}
                label="My Profile"
                active
              />
              <SideLink
                to="/account/address"
                icon={<LocationOnOutlinedIcon />}
                label="Address Book"
              />
              <SideLink
                to="/account/payment"
                icon={<CreditCardOutlinedIcon />}
                label="Payment Options"
              />
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography
              variant="overline"
              sx={{
                color: "text.secondary",
                letterSpacing: 1,
                mb: 1,
                display: "block",
              }}
            >
              My Orders
            </Typography>
            <Stack spacing={1}>
              <SideLink
                to="/orders"
                icon={<AssignmentOutlinedIcon />}
                label="Orders"
              />
              <SideLink
                to="/account/returns"
                icon={<AutorenewOutlinedIcon />}
                label="Returns"
              />
              <SideLink
                to="/account/cancellations"
                icon={<AssignmentOutlinedIcon />}
                label="Cancellations"
              />
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography
              variant="overline"
              sx={{
                color: "text.secondary",
                letterSpacing: 1,
                mb: 1,
                display: "block",
              }}
            >
              My Wishlist
            </Typography>
            <Stack spacing={1}>
              <SideLink
                to="/wishlist"
                icon={<FavoriteBorderOutlinedIcon />}
                label="Wishlist"
              />
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Stack direction="row" spacing={1} alignItems="center">
              <LogoutOutlinedIcon fontSize="small" color="error" />
              <MUILink
                component={NavLink}
                to="#"
                underline="hover"
                color="error.main"
                fontWeight={700}
              >
                Logout
              </MUILink>
            </Stack>
          </Box>

          {/* ---- RIGHT ---- */}
          <Stack flex={1} spacing={3}>
            <SectionCard title="Edit Your Profile">
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={2}
                sx={{ mb: 2 }}
              >
                {/* Nickname */}
                <TextField
                  label={AccountPage?.memberNick}
                  fullWidth
                  value={profileForm.memberNick}
                  onChange={onProfileInput("memberNick")}
                />
                {/* Phone */}
                <TextField
                  label={AccountPage?.memberPhone}
                  fullWidth
                  value={profileForm.memberPhone}
                  onChange={onProfileInput("memberPhone")}
                />
              </Stack>

              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={2}
                sx={{ mb: 3 }}
              >
                {/* Email (demo) */}
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  defaultValue="exaplme@mail.com"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MailOutlineIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                {/* Address */}
                <TextField
                  label={AccountPage?.memberAddress}
                  fullWidth
                  value={profileForm.memberAddress}
                  onChange={onProfileInput("memberAddress")}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOnOutlinedIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>

              <Divider sx={{ mb: 3 }} />
              <Typography fontWeight={700} sx={{ mb: 1 }}>
                Password Changes
              </Typography>

              <Stack spacing={2} sx={{ mb: 3 }}>
                {/* Current */}
                <TextField
                  label="Current Password"
                  type="password"
                  fullWidth
                  value={passwordForm.memberPassword}
                  onChange={onPasswordInput("memberPassword")}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                {/* New */}
                <TextField
                  label="New Password"
                  type="password"
                  fullWidth
                  value={passwordForm.memberNewPassword}
                  onChange={onPasswordInput("memberNewPassword")}
                />
                {/* Confirm */}
                <TextField
                  label="Confirm New Password"
                  type="password"
                  fullWidth
                  value={passwordForm.memberConfirmPassword}
                  onChange={onPasswordInput("memberConfirmPassword")}
                />
              </Stack>

              <Stack direction="row" justifyContent="flex-end" spacing={1.5}>
                <Button
                  variant="outlined"
                  sx={{
                    textTransform: "none",
                    borderRadius: 2,
                    px: 2.5,
                    borderColor: alpha(t.palette.text.primary, 0.2),
                    "&:hover": { borderColor: t.palette.text.primary },
                  }}
                  onClick={() => {
                    if (!AccountPage) return;
                    setProfileForm({
                      memberNick: AccountPage.memberNick ?? "",
                      memberPhone: AccountPage.memberPhone ?? "",
                      memberAddress: AccountPage.memberAddress ?? "",
                      memberDesc: AccountPage.memberDesc ?? "",
                      memberImage: AccountPage.memberImage ?? "",
                    });
                    setPasswordForm({
                      memberPassword: "",
                      memberNewPassword: "",
                      memberConfirmPassword: "",
                    });
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    textTransform: "none",
                    borderRadius: 2,
                    px: 2.5,
                    bgcolor: t.palette.primary.main,
                    boxShadow: "0 10px 18px rgba(219,68,68,.25)",
                    "&:hover": { bgcolor: "#c93737" },
                  }}
                  onClick={handleSave}
                >
                  Save Changes
                </Button>
              </Stack>
            </SectionCard>

            <SectionCard title="Account Highlights">
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Box
                  sx={{
                    flex: 1,
                    p: 2,
                    borderRadius: 2,
                    border: `1px dashed ${alpha(t.palette.primary.main, 0.4)}`,
                    bgcolor: alpha(t.palette.primary.main, 0.04),
                  }}
                >
                  <Typography fontWeight={700} fontSize={18}>
                    6
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Orders placed
                  </Typography>
                </Box>
                <Box
                  sx={{
                    flex: 1,
                    p: 2,
                    borderRadius: 2,
                    border: `1px dashed ${alpha(t.palette.success.main, 0.4)}`,
                    bgcolor: alpha(t.palette.success.main, 0.04),
                  }}
                >
                  <Typography fontWeight={700} fontSize={18}>
                    2
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    In delivery
                  </Typography>
                </Box>
                <Box
                  sx={{
                    flex: 1,
                    p: 2,
                    borderRadius: 2,
                    border: `1px dashed ${alpha(t.palette.warning.main, 0.4)}`,
                    bgcolor: alpha(t.palette.warning.main, 0.05),
                  }}
                >
                  <Typography fontWeight={700} fontSize={18}>
                    4
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Wishlist items
                  </Typography>
                </Box>
              </Stack>
            </SectionCard>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
