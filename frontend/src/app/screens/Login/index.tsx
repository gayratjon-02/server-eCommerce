import { Button, Container, Stack } from "@mui/material";
import "../../../css/login.css";
import { NavLink, useHistory } from "react-router-dom";
import { useState } from "react";
import { T } from "../../../lib/types/common";
import { LoginInput } from "../../../lib/types/member";
import { Messages } from "../../../lib/config";
import MemberService from "../../services/MemberService";
import {
  sweetErrorHandling,
  sweetTopSuccessAlert,
} from "../../../lib/sweetAlert";
import { useGlobals } from "../../hooks/useGlobals";

export default function Login() {
  const [memberNick, setMemberNick] = useState("");
  const [memberPassword, setMemberPassword] = useState("");
  const history = useHistory();
  const { setAuthMember } = useGlobals();

  /** 🔹 Login handler **/
  const handleLoginRequest = async () => {
    try {
      if (!memberNick || !memberPassword) throw new Error(Messages.error3);

      const loginInputs: LoginInput = { memberNick, memberPassword };
      const memberService = new MemberService();
      const member = await memberService.login(loginInputs);

      // 🔸 Contextni yangilaymiz (refresh kerak emas)
      setAuthMember(member);

      await sweetTopSuccessAlert("Login successfully!");
      history.push("/"); // redirect to homepage
    } catch (err) {
      console.error("Login error:", err);
      sweetErrorHandling(err);
    }
  };

  /** 🔹 Enter bosilganda login **/
  const handlePasswordKeyDown = (e: T) => {
    if (e.key === "Enter") handleLoginRequest();
  };

  return (
    <Container className="signup-container">
      <Stack className="signup-main" direction="row">
        {/* 🔹 Left Image Section */}
        <Stack className="signup-left">
          <img src="/img/phone-sign.png" alt="Sign In" />
        </Stack>

        {/* 🔹 Right Form Section */}
        <Stack className="signup-right">
          <h1>Login to your account</h1>
          <p>Enter your details below</p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLoginRequest();
            }}
          >
            <input
              type="email"
              placeholder="Email or Phone Number"
              value={memberNick}
              onChange={(e) => setMemberNick(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              value={memberPassword}
              onChange={(e) => setMemberPassword(e.target.value)}
              onKeyDown={handlePasswordKeyDown}
            />

            <Button
              className="signup-butt"
              variant="contained"
              color="error"
              onClick={handleLoginRequest}
              fullWidth
            >
              Login
            </Button>

            <Button className="signup-butt2" fullWidth>
              <img src="/icons/Icon-Google.png" alt="Google" />
              <NavLink to="https://devex.uz/com">Sign up with Google</NavLink>
            </Button>

            <Stack
              className="have-account"
              direction="row"
              justifyContent="center"
              alignItems="center"
            >
              <span>Forget Password?</span>
            </Stack>
          </form>
        </Stack>
      </Stack>
    </Container>
  );
}
