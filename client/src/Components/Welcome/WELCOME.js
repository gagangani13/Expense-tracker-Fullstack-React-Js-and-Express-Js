import React, { useEffect, useState } from "react";
import { Navbar, Container, Button, NavLink } from "react-bootstrap";
import { Route, Redirect } from "react-router-dom";
import ExpenseForm from "./ExpenseForm";
import { useSelector, useDispatch } from "react-redux";
import { authAction } from "../Store/authSlice";
import { expenseAction } from "../Store/expenseSlice";
import "./toggleSwitch.css";
import "./welcome.css";
import { themeAction } from "../Store/themeSlice";
import axios from "axios";
import Leaderboard from "./Leaderboard";
import Downloads from "./Downloads";
import ToggleSwitch from "./ToggleSwitch";

const WELCOME = () => {
  useEffect(() => {
    const idToken = localStorage.getItem("idToken");
    const userId = localStorage.getItem("userId");
    const activatePremium = localStorage.getItem("premium");
    if (idToken && userId) {
      dispatch(authAction.loginHandler());
      dispatch(authAction.setToken(idToken));
      dispatch(authAction.setUserId(userId));
      activatePremium!=='null' && dispatch(authAction.setActivatePremium(true));
    }
    // eslint-disable-next-line
  }, []);
    
  const login = useSelector((state) => state.authenticate.login);
  const light = useSelector((state) => state.theme.light);
  const activatePremium = useSelector((state) => state.authenticate.activatePremium);
  const idToken = useSelector((state) => state.authenticate.idToken);
  const dispatch = useDispatch();
  const [leaderboard,setLeaderboard]=useState(false)
  const[viewDownloads,setViewDownloads]=useState(false)
  const [addExpense,setAddExpense]=useState(true)

  function logoutHandler() {
    dispatch(authAction.logoutHandler());
    localStorage.removeItem("idToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("premium");
    !light && dispatch(themeAction.setLight());
    // activatePremium && dispatch(expenseAction.setActivatePremium(false));
  }
  function setTheme() {
    dispatch(themeAction.setLight());
  }
  async function activation(e) {
    if (activatePremium && !light) {
      dispatch(themeAction.setLight());
    }
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
              localStorage.setItem('premium',true)
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
      e.preventDefault();
    } else if (activatePremium) {
      localStorage.setItem("activatePremium", false);
      dispatch(expenseAction.setActivatePremium(false));
    }
  }
  function showLeaderboard() {
    setLeaderboard(!leaderboard)
    viewDownloads&&setViewDownloads(false)
    addExpense&&setAddExpense(false)
  }
  function setDownloads(){
    setViewDownloads(!viewDownloads)
    leaderboard&&setLeaderboard(false)
    addExpense&&setAddExpense(false)
  }
  function showExpense() {
    setAddExpense(!addExpense)
    leaderboard&&setLeaderboard(false)
    viewDownloads&&setViewDownloads(false)
  }
  // !viewDownloads&&!leaderboard&&!addExpense&&setAddExpense(true)
  async function downloadExpenses(e) {
    const response=await axios.get('http://localhost:5000/downloadAWS',{headers:{'Authorization':idToken}})
    const data=await response.data
    try {
      if(data.ok){
        const a=document.createElement('a')
        a.href=data.fileUrl
        a.download='Myexpense.csv'
        a.click()
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div className="background"></div>
      <>
        {login && (
          <>
            <Navbar
              expand="sm"
              variant="dark"
              className="position-fixed w-100 text-l"
              id="Navbar"
            >
              <Container>
                <h1 id="welcomeH1">Expense Tracker</h1>

                {activatePremium && <ToggleSwitch setTheme={setTheme}/>}

                {!activatePremium && (
                  <Button variant="success" type="button" onClick={activation}>
                    Activate Premium
                  </Button>
                )}
                {activatePremium&&<NavLink className='activeLink' onClick={showExpense}>ADD EXPENSE</NavLink>}
                {activatePremium&&<NavLink className='activeLink' onClick={showLeaderboard}>LEADERBOARD</NavLink>}
                {activatePremium&&<NavLink className='activeLink' onClick={setDownloads}>VIEW DOWNLOADS</NavLink>}
                {activatePremium && (
                  <Button type='button' onClick={downloadExpenses}>
                    <i class="fa-solid fa-download fa-lg"></i>
                  </Button>
                )}

                <Button variant="danger" onClick={logoutHandler}>
                  LOGOUT
                </Button>
              </Container>
            </Navbar>
            {addExpense&&<ExpenseForm />}
            {leaderboard&&<Leaderboard/>}
            {viewDownloads&&<Downloads/>}
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
