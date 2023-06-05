import React, { useEffect, useState } from "react";
import { Navbar, Container, NavLink, Button, } from "react-bootstrap";
import { Route, Redirect } from "react-router-dom";
import ProfileDisplay from "./ProfileDisplay";
import ExpenseForm from "./ExpenseForm";
import { useSelector, useDispatch } from "react-redux";
import { authAction } from "../Store/authSlice";
import { expenseAction } from "../Store/expenseSlice";
import "./toggleSwitch.css";
import "./welcome.css"
import { themeAction } from "../Store/themeSlice";
import axios from "axios";
const WELCOME = () => {
  useEffect(() => {
    const idToken = localStorage.getItem("idToken");
    const userId = localStorage.getItem("userId");
    const premium = localStorage.getItem("premium");
    const activatePremium = localStorage.getItem("activatePremium");
    if (idToken && userId) {
      dispatch(authAction.loginHandler());
      dispatch(authAction.setToken(idToken));
      dispatch(authAction.setUserId(userId));
      activatePremium&&dispatch(expenseAction.setActivatePremium(true))
      premium&&dispatch(expenseAction.setPremium(true))
      fromDatabase();
    }
    // eslint-disable-next-line
  }, []);
  async function fromDatabase() {
    const token = localStorage.getItem("idToken");
    const response = await axios.get('http://localhost:5000/getExpenses',{headers:{'Authorization':token}})
    const data = await response.data
    try {
      if (data.ok) {
        let arr = [];
        const expense=data.expenses
        for (const item in expense) {
          arr.unshift({
            amount: expense[item].amount,
            description: expense[item].description,
            category: expense[item].category,
            expenseId: expense[item].id,
          });
        }
        dispatch(expenseAction.reloadExpense(arr));
      } else {
        throw new Error();
      }
    } catch (error) {
      alert(data.error.message);
    }
  }
  const login = useSelector((state) => state.authenticate.login);
  const premium = useSelector((state) => state.expenseList.premium);
  const light= useSelector((state) => state.theme.light);
  const activatePremium= useSelector((state) => state.expenseList.activatePremium);
  const expenses= useSelector((state) => state.expenseList.expenses);
  const dispatch = useDispatch();
  const [verify, setVerify] = useState(false);
  const [profile, setProfile] = useState(false);
  let Url;
  function setProfileHandler() {
    setProfile(!profile);
  }
  function logoutHandler() {
    dispatch(authAction.logoutHandler());
    localStorage.removeItem("idToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("premium");
    localStorage.removeItem("activatePremium");
    !light&&dispatch(themeAction.setLight())
    activatePremium&&dispatch(expenseAction.setActivatePremium(false))
    
  }
  function setTheme(){
      dispatch(themeAction.setLight())
  }
  function activation() {
    if(activatePremium && !light){
      dispatch(themeAction.setLight())
    }
    if(!activatePremium){
      localStorage.setItem('activatePremium',true)
      dispatch(expenseAction.setActivatePremium(true))
    }else if(activatePremium){
      localStorage.setItem('activatePremium',false)
      dispatch(expenseAction.setActivatePremium(false))
    }
  }
  function downloadExpenses() {
    const makeCsv=expenses.map((item)=>{
      return (`${item.amount},${item.description},${item.category}`)
    })
    makeCsv.unshift(['Amount','Description','Category'].join(','))
    console.log(makeCsv)
    const blob1=new Blob([makeCsv])
    Url=URL.createObjectURL(blob1)
  }
  activatePremium&&downloadExpenses()
  !premium&&activatePremium&&activation()
  async function verifyHandler(e) {
    if (!verify) {
      e.preventDefault();
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyBXPzqlI6fvUIQX7LiIqUK-vdC_dfWQ0q8`,
        {
          method: "POST",
          body: JSON.stringify({
            requestType: "VERIFY_EMAIL",
            idToken: localStorage.getItem("idToken"),
          }),
        }
      );
      const data = await response.json();
      try {
        if (response.ok) {
          setVerify(true);
        } else {
          throw new Error();
        }
      } catch (error) {
        alert(data.error.message);
      }
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
              <h1 id="welcomeH1">Welcome To Expense Tracker</h1>
              <NavLink style={{ color: light?"blue":'white' }} onClick={setProfileHandler}>
                View Profile
              </NavLink>
              <Button
                variant={verify ? "success" : "warning"}
                type="submit"
                onClick={verifyHandler}
              >
                {verify ? "Verified" : "Verify User"}
              </Button>
              {premium&&activatePremium&&<div>
                <i class="fa-solid fa-sun fa-lg" style={{verticalAlign: 'middle'}}></i>
                <label class="switch">
                  <input type="checkbox" onClick={setTheme} />
                  <span class="slider round"></span>
                </label>
                <i class="fa-solid fa-moon fa-lg" style={{verticalAlign: 'middle'}}></i>
              </div>}
              {premium && (
                <Button variant="success" type="button" onClick={activation}>
                  {activatePremium? 'Deactivate Premium':'Activate Premium'}
                </Button>
              )}
              {premium&&activatePremium &&<a href={Url} download='Expenses.csv'><i class="fa-solid fa-download fa-lg" ></i></a>}
              <Button variant="danger" onClick={logoutHandler}>
                LOGOUT
              </Button>
            </Container>
          </Navbar>
          <ExpenseForm />
        </>
      )}
      {profile && <ProfileDisplay profile={setProfileHandler} />}
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
