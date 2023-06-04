import { useRef, useState } from "react";
import { Form, NavLink, Button, FloatingLabel } from "react-bootstrap";
import {  useSelector } from "react-redux";
import { Route, Redirect } from "react-router-dom";
// import { authAction } from "../Store/authSlice";
import axios from "axios";
import "./login.css";
const LOGIN = () => {
  // const dispatch = useDispatch();
  const loginState = useSelector((state) => state.authenticate.login);
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmRef = useRef();
  const [login, setLogin] = useState(true);
  const [newPassword, setNewPassword] = useState(false);

  function setLoginHandler() {
    if (login) {
      setLogin(false);
    } else {
      setLogin(true);
    }
  }
  function setPasswordHandler() {
    if (newPassword) {
      setNewPassword(false);
    } else {
      setNewPassword(true);
    }
  }
  async function addData(e) {
    e.preventDefault();
    const details={email:emailRef.current.value,password:passwordRef.current.value}
    if (!login) {
      if (passwordRef.current.value === confirmRef.current.value) {
        const response = await axios.post('http://localhost:5000/newUser',details)
        const data = await response.data;
        try {
          if (response) {
            emailRef.current.value = "";
            passwordRef.current.value = "";
            confirmRef.current.value = "";
            alert(data.message);
            setLogin(true);
          } else {
            throw new Error(data.message);
          }
        } catch (error) {
          console.log(error.message)
        }
      } else {
        alert("Password not matching");
      }
    } else if (login && newPassword) {
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyBXPzqlI6fvUIQX7LiIqUK-vdC_dfWQ0q8`,
        {
          method: "POST",
          body: JSON.stringify({
            requestType: "PASSWORD_RESET",
            email: emailRef.current.value,
          }),
        }
      );
      const data = await response.json();
      try {
        if (response.ok) {
          alert("Email sent");
          setNewPassword(false);
          emailRef.current.value = "";
        } else {
          throw new Error();
        }
      } catch (error) {
        alert(data.error.message);
      }
    } else {
      const response = await axios.post('http://localhost:5000/loginUser',details)

      const data = await response.data;
      try {
        if (data.ok) {
          emailRef.current.value = "";
          passwordRef.current.value = "";
          // const token = localStorage.setItem("idToken", data.idToken);
          // const userId = localStorage.setItem("userId", data.localId);
          // dispatch(authAction.loginHandler());
          // dispatch(authAction.setToken(token));
          // dispatch(authAction.setUserId(userId));
          console.log(data);
        } else {
          throw new Error();
        }
      } catch (error) {
        alert(data.message);
      }
    }
  }
  return (
    <>
      <div id="webpage"></div>
      <>
        <h1>Expense Tracker</h1>
        <div className="layout">
          <h2 className="my-4">
            {!newPassword && (login ? "LOGIN" : "SIGN UP")}
            {newPassword && "CHANGE PASSWORD"}
          </h2>
          <div id="container">
            {newPassword && <p>Enter the registered Email</p>}
            <Form className="d-grid" onSubmit={addData}>
              <FloatingLabel
                controlId="floatingInput"
                label="Email"
                className="mb-3 text-dark"
              >
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  ref={emailRef}
                  required
                />
              </FloatingLabel>
              {!newPassword && (
                <FloatingLabel
                  controlId="floatingPassword"
                  label="Password"
                  className="mb-3 text-dark"
                >
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    ref={passwordRef}
                    required
                  />
                </FloatingLabel>
              )}
              {!login && (
                <FloatingLabel
                  controlId="floatingInput"
                  label="Confirm Password"
                  className="mb-3 text-dark"
                >
                  <Form.Control
                    type="text"
                    placeholder="Enter password"
                    ref={confirmRef}
                    required
                  />
                </FloatingLabel>
              )}
              {!newPassword && login && (
                <NavLink
                  className="d-flex justify-content-center mb-3"
                  id="NavLink"
                  onClick={setPasswordHandler}
                >
                  Forgot Password ?
                </NavLink>
              )}
              {!newPassword && (
                <Button className="mb-3" variant="primary" type="submit">
                  {login ? "LOGIN" : "SIGN UP"}
                </Button>
              )}
              {newPassword && (
                <Button className="mb-3" variant="primary" type="submit">
                  SEND LINK
                </Button>
              )}
              <div className="d-flex justify-content-center">
                {!newPassword && login
                  ? "Don't have an account?"
                  : "Already have an account?"}
                {!newPassword && (
                  <NavLink id="NavLink" onClick={setLoginHandler}>
                    {!login ? "LOGIN" : "SIGN UP"}
                  </NavLink>
                )}
                {newPassword && (
                  <NavLink id="NavLink" onClick={setPasswordHandler}>
                    LOGIN
                  </NavLink>
                )}
              </div>
            </Form>
            {loginState && (
              <Route>
                <Redirect to="/WELCOME" />
              </Route>
            )}
          </div>
        </div>
      </>
    </>
  );
};

export default LOGIN;
