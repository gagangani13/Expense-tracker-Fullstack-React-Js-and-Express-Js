import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import './Leaderboard.css'
const Leaderboard =  () => {
    const [expenses, loadExpenses] = useState([]);
    const idToken = useSelector((state) => state.authenticate.idToken);
    async function leaderboardExpenses(){
        const response = await axios.get("http://localhost:5000/allExpenses", {
            headers: { Authorization: idToken },
        });
        const data = await response.data.expenses;
        try {
            let arr = [];
            for (let element in data) {
                arr.push({ name: data[element].name, totalExpense: data[element].totalExpense?data[element].totalExpense:0, order:Number(element)+1 });
            }
            loadExpenses(arr);
        } catch (error) {
          console.log(error);
        }
    }
    useEffect(()=>{
        leaderboardExpenses()
        // eslint-disable-next-line
    },[])
  return (
    <div id='leaderboard'>
      <h1 id='leaderH1'>Leaderboard</h1>
      <li id='listItem'>
        <span id='spanLeaderboard'>Rank</span>
        <span id='spanLeaderboard'>User</span>
        <span id='spanLeaderboard'>Total</span>
      </li>
        {expenses.map((item) => {
          return <li id='listItem'>
            <span id='spanLeaderboard'>{item.order}</span>
            <span id='spanLeaderboard'>{item.name}</span>
            <span id='spanLeaderboard'>{item.totalExpense}</span>
            </li>;
        })}
    </div>
  );
};

export default Leaderboard;
