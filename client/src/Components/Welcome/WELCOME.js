import React, { useEffect, useState } from "react";
import { Dropdown, Navbar, NavLink } from "react-bootstrap";
import { Route, Redirect } from "react-router-dom";
import ExpenseForm from "./ExpenseForm";
import { useSelector, useDispatch } from "react-redux";
import { authAction } from "../Store/authSlice";
import { expenseAction } from "../Store/expenseSlice";
import "./welcome.css";
import axios from "axios";
import Leaderboard from "./Leaderboard";
import { AnimatePresence, motion } from "framer-motion";
import Downloads from "./Downloads";

//Animation
const navbarVariant = {
  whileHover: {
    scale: 1.1,
    x: 0,
    fontWeight: "bold",
    transition: {
      yoyo: Infinity, //yoyo is a repeating key, you can set to repeat n no of times ex-5 or infinte
    },
  },
};

//
const WELCOME = () => {
  useEffect(() => {
    const idToken = localStorage.getItem("idToken");
    const userId = localStorage.getItem("userId");
    const activatePremium = localStorage.getItem("premium");
    if (idToken && userId) {
      dispatch(authAction.loginHandler());
      dispatch(authAction.setToken(idToken));
      dispatch(authAction.setUserId(userId));
      activatePremium !== "null" &&
        dispatch(authAction.setActivatePremium(true));
    }
    // eslint-disable-next-line
  }, []);

  const login = useSelector((state) => state.authenticate.login);
  const activatePremium = useSelector(
    (state) => state.authenticate.activatePremium
  );
  const idToken = useSelector((state) => state.authenticate.idToken);
  const dispatch = useDispatch();
  const [leaderboard, setLeaderboard] = useState(false);
  const [viewDownloads, setViewDownloads] = useState(false);
  const [addExpense, setAddExpense] = useState(true);
  const [menu, setMenu] = useState(false);

  function logoutHandler() {
    dispatch(authAction.logoutHandler());
    localStorage.removeItem("idToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("premium");
    localStorage.removeItem("size");
    localStorage.removeItem("currentPage");
  }
  async function activation(e) {
    setMenu(false)
    setAddExpense(false);
    e.preventDefault();
    if (!activatePremium) {
      const response = await axios.get(
        "http://localhost:5000/purchasePremium",
        { headers: { Authorization: idToken } }
      );
      const data = await response.data;
      try {
        var options = {
          //whatever I write here will go to pop up Razorpay
          key: data.key_id,
          orderId: data.order.id,
          amount: data.order.amount,
          handler: async (response) => {
            const response2 = await axios.post(
              "http://localhost:5000/updateTransactionStatus",
              {
                orderId: options.orderId,
                paymentId: response.razorpay_payment_id,
              },
              { headers: { Authorization: idToken } }
            );
            try {
              alert(response2.data.message);
              dispatch(authAction.setActivatePremium(true));
              localStorage.setItem("premium", true);
            } catch (error) {
              console.log(error);
            }
          },
        };
      } catch (error) {
        console.log(error);
      }
      const rzp = new window.Razorpay(options);
      rzp.open();
    } else if (activatePremium) {
      localStorage.setItem("activatePremium", false);
      dispatch(expenseAction.setActivatePremium(false));
    }
  }
  function showLeaderboard() {
    setMenu(false)
    setLeaderboard(true);
    viewDownloads && setViewDownloads(false);
    addExpense && setAddExpense(false);
  }
  function setDownloads() {
    setMenu(false)
    setViewDownloads(true);
    leaderboard && setLeaderboard(false);
    addExpense && setAddExpense(false);
  }
  function showExpense() {
    setMenu(false)
    setAddExpense(true);
    leaderboard && setLeaderboard(false);
    viewDownloads && setViewDownloads(false);
  }
  async function downloadExpenses(e) {
    setMenu(false)
    const response = await axios.get("http://localhost:5000/downloadAWS", {
      headers: { Authorization: idToken },
    });
    const data = await response.data;
    try {
      if (data.ok) {
        const a = document.createElement("a");
        a.href = data.fileUrl;
        a.download = "Myexpense.csv";
        a.click();
      }
    } catch (error) {
      console.log(error);
    }
  }
  function showMenu() {
    setMenu(!menu);
  }

  return (
    <>
      <div className="background"></div>
      <>
        {login && (
          <>
            <div className="header">
              <Navbar id="Navbar">
                <h1 className="welcomeH1">Expense Tracker</h1>
                <AnimatePresence>
                  {menu && (
                    <motion.div
                    className="NavLinks"
                    initial={{ y: "-100vw" }}
                    animate={{ y: "0vw" }}
                    transition={{ type: "tween", stiffness: 100 }}
                    exit={{y:'-100vw'}}
                    >
                      {activatePremium && (
                        <motion.span
                        variants={navbarVariant}
                        whileHover="whileHover"
                        >
                          {<NavLink onClick={showExpense}>ADD EXPENSE</NavLink>}
                        </motion.span>
                      )}
                      {!activatePremium && (
                        <motion.div variants={navbarVariant} whileHover="whileHover">
                          <NavLink onClick={activation}>Activate Premium</NavLink>
                        </motion.div>
                      )}
                      {activatePremium && (
                        <motion.span
                          variants={navbarVariant}
                          whileHover="whileHover"
                        >
                          <NavLink onClick={showLeaderboard}>
                            LEADERBOARD
                          </NavLink>
                        </motion.span>
                      )}
                      {activatePremium && (
                        <motion.span
                          variants={navbarVariant}
                          whileHover="whileHover"
                        >
                          <Dropdown>
                            <Dropdown.Toggle variant="success">
                              DOWNLOAD
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item onClick={setDownloads}>
                                View Downloads
                              </Dropdown.Item>
                              <Dropdown.Item onClick={downloadExpenses}>
                                Download
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </motion.span>
                      )}
                      <motion.span
                        variants={navbarVariant}
                        whileHover="whileHover"
                      >
                        <NavLink onClick={logoutHandler}>LOGOUT</NavLink>
                      </motion.span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Navbar>
              <button className="menuBar" onClick={showMenu}>
                {!menu ? (
                  <i class="fa-solid fa-bars fa-lg " />
                ) : (
                  <i class="fa-solid fa-xmark fa-lg" />
                )}
              </button>
            </div>
            <>
              {!menu&&addExpense && <ExpenseForm />}
              {!menu&&leaderboard && <Leaderboard />}
              {!menu&&viewDownloads && <Downloads />}
            </>
          </>
        )}
        {!login && (
          <Route>
            <Redirect to="/" />
          </Route>
        )}
      </>
    </>
  );
};

export default WELCOME;
