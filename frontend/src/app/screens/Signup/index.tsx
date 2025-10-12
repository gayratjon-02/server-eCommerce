import { Button, Container, Stack } from "@mui/material";
import { NavLink, useHistory } from "react-router-dom";
import "../../../css/signup.css";
import { useEffect, useState } from "react";
import { T } from "../../../lib/types/common";
import { Messages } from "../../../lib/config";
import { MemberInput } from "../../../lib/types/member";
import MemberService from "../../services/MemberService";
import {
  sweetErrorHandling,
  sweetTopSuccessAlert,
} from "../../../lib/sweetAlert";

export default function Signup() {
  const [memberNick, setMemberNick] = useState<string>("");
  const [memberPhone, setMemberPhone] = useState<string>("");
  const [memberPassword, setMemberPassword] = useState<string>("");

  const history = useHistory();

  /** HANDLERS **/

  const handleUsername = (e: T) => {
    setMemberNick(e.target.value);
  };

  const handlePhone = (e: T) => {
    setMemberPhone(e.target.value);
  };

  const handlePassword = (e: T) => {
    setMemberPassword(e.target.value);
  };

  const handleSignupRequest = async () => {
    try {
      const isFullFill =
        memberNick !== "" && memberPhone !== "" && memberPassword !== "";

      if (!isFullFill) throw new Error(Messages.error3);
      const signupInputs: MemberInput = {
        memberNick: memberNick,
        memberPhone: memberPhone,
        memberPassword: memberPassword,
      };

      const memberService = new MemberService();
      const result = await memberService.signup(signupInputs);

      (document.querySelector("form") as HTMLFormElement).reset();
      sweetTopSuccessAlert("Signup successfully");
      history.push("/");
    } catch (err) {
      console.log(err);
      sweetErrorHandling(err).then();
    }
  };

  const handlePasswordKeyDown = (e: T) => {
    if (e.key === "Enter") {
      handleSignupRequest().then();
    }
  };

  return (
    <Container className="signup-container">
      <Stack className="signup-main" flexDirection={"row"}>
        <Stack className="signup-left">
          <img src="/img/phone-sign.png" alt="" />
        </Stack>
        <Stack className="signup-right">
          <h1>Create an account</h1>
          <p>Enter your details below</p>

          <form action="#">
            <input type="text" placeholder="Name" onChange={handleUsername} />
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email or Phone Number"
              onChange={handlePhone}
            />
            <input
              type="password"
              placeholder="Password"
              onChange={handlePassword}
              onKeyDown={handlePasswordKeyDown}
            />

            <Button className="signup-butt" onClick={handleSignupRequest}>
              Create Account
            </Button>
            <Button className="signup-butt2">
              <img src="/icons/Icon-Google.png" alt="" />
              <NavLink to={"#"}>Sign up with Google</NavLink>
            </Button>

            <Stack
              className="have-account"
              flexDirection={"row"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <p>Already have account?</p>
              <NavLink to={"/login"} className={"login-link"}>
                Log in
              </NavLink>
            </Stack>
          </form>
        </Stack>
      </Stack>
    </Container>
  );
}
