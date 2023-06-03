import React, {  useRef, useState } from "react";
import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { expenseAction } from "../Store/expenseSlice";
const ExpenseForm = () => {
  const dispatch=useDispatch()
  const expenses=useSelector((state)=>state.expenseList.expenses)
  const editing=useSelector((state)=>state.expenseList.editing)
  const userId=useSelector((state)=>state.authenticate.userId)
  const light= useSelector((state) => state.theme.light);
  const[load,setLoad]=useState(false)
  const amountRef = useRef();
  const descriptionRef = useRef();
  const categoryRef = useRef();
  let totalAmount=0
  async function addExpenses(e) {
    e.preventDefault();
    setLoad(true)
    let details = {
      amount: amountRef.current.value,
      description: descriptionRef.current.value,
      category: categoryRef.current.value,
    };
    if (editing===null) {
      const response = await fetch(
        `https://signup-and-authenticatio-f712f-default-rtdb.firebaseio.com/Users/${userId}.json`,
        {
          method: "POST",
          body: JSON.stringify(details),
        }
      );
      const data = await response.json();
      try {
        setLoad(false)
        if (response.ok) {
          details={...details,expenseId:data.name}
          amountRef.current.value = "";
          descriptionRef.current.value = "";
          categoryRef.current.value = "";
          console.log(details);
          dispatch(expenseAction.loadExpenses(details))
        } else {
          throw new Error();
        }
      } catch (error) {
        console.log(data);
        alert(data.error.message);
      }
    } else {
      const response = await fetch(
        `https://signup-and-authenticatio-f712f-default-rtdb.firebaseio.com/Users/${userId}/${editing}.json`,
        {
          method: "PUT",
          body: JSON.stringify(details),
        }
      );
      const data = await response.json();
      try {
        setLoad(false)
        if (response.ok) {
          amountRef.current.value = "";
          descriptionRef.current.value = "";
          categoryRef.current.value = "";
          const editArray=expenses.filter((item)=>{
            return item.expenseId!==editing 
          })
          editArray.unshift({...details,expenseId:editing})
          dispatch(expenseAction.reloadExpense(editArray))
          dispatch(expenseAction.editExpense(null))
        } else {
          throw new Error();
        }
      } catch (error) {
        console.log(data);
        alert(data.error.message);
      }
    }
  }
  async function deleteExpense(e) {
    setLoad(true)
    const key = e.target.parentElement.id;
    console.log(userId,key)
    const response = await fetch(
      `https://signup-and-authenticatio-f712f-default-rtdb.firebaseio.com/Users/${userId}/${key}.json`,
      {
        method: "DELETE",
      }
    );
    const data = await response.json();
    try {
      console.log(data);
        setLoad(false)
      if (response.ok) {
        const deleteArray=expenses.filter((item)=>{
          return item.expenseId!==key
        })
        console.log(deleteArray);
        dispatch(expenseAction.reloadExpense(deleteArray))
      } else {
        throw new Error();
      }
    } catch (error) {
      alert(data.error.message);
    }
  }
  async function editExpense(e) {
    setLoad(true)
    const key = e.target.parentElement.id;
    const response = await fetch(
      `https://signup-and-authenticatio-f712f-default-rtdb.firebaseio.com/Users/${userId}/${key}.json`
    );
    const data = await response.json();
    try {
        setLoad(false)
      if (response.ok) {
        amountRef.current.value = data.amount;
        descriptionRef.current.value = data.description;
        categoryRef.current.value = data.category;
        dispatch(expenseAction.editExpense(key))
      } else {
        throw new Error();
      }
    } catch (error) {
      alert(data.error.message);
    }
  }
  return (
    <div style={{
      position: "absolute",
      top: "8rem",
      width: "70%",
      left: "15%",
      textAlignLast: 'center',
    }}>
      <Form
        style={{
          margin:'2rem 0rem',
          backgroundColor:light?'#bdcfc7':'rgb(88 94 92)',
          padding: '2rem 0rem',
          borderRadius: '1rem',
          color:light?'black':'white'
        }}
        onSubmit={addExpenses}
      >
        <h3>ADD EXPENSES</h3>
        <Row>
          <Col>
            <Form.Control
              placeholder="Amount"
              type="number"
              ref={amountRef}
              required
            />
          </Col>
          <Col>
            <Form.Control
              placeholder="Description"
              type="text"
              ref={descriptionRef}
              required
            />
          </Col>
          <Col>
            <Form.Select defaultValue="Me" ref={categoryRef} required>
              <option>Me</option>
              <option>Family</option>
              <option>Friends</option>
            </Form.Select>
          </Col>
          <Col>
            <Button variant="dark" type="submit">
              ADD
            </Button>
          </Col>
        </Row>
      </Form>
      <>
        {load&&<h5>Loading...</h5>}
        {expenses.map((item) => {
          totalAmount+=Number(item.amount);
          if(totalAmount>=10000){
            dispatch(expenseAction.setPremium(true))
            localStorage.setItem('premium',true)
          }
          else{
            dispatch(expenseAction.setPremium(false))
            localStorage.setItem('premium',false)
          }
          return (
            <Card className='mb-2'>
              <Card.Body
                id={item.expenseId}
                className="d-flex justify-content-around align-items-baseline"
                style={{backgroundColor:light?'#bdcfc7':'rgb(88 94 92)',fontSize:'larger',fontWeight:'bold',color:light?'black':'white'}}
              >
                <Card.Text>Rs.{item.amount} </Card.Text>
                <Card.Text>{item.description} </Card.Text>
                <Card.Text>{item.category}</Card.Text>
                <button
                  onClick={editExpense}
                  class="fa-solid fa-pen"
                  style={{ padding: "5px", borderRadius: "1rem" }}
                ></button>
                <button
                  onClick={deleteExpense}
                  class="fa-solid fa-trash-can"
                  style={{
                    color: "#d90d0d",
                    padding: "5px",
                    borderRadius: "1rem",
                  }}
                ></button>
              </Card.Body>
            </Card>
          );
        })}
      </>
    </div>
  );
};

export default ExpenseForm;
