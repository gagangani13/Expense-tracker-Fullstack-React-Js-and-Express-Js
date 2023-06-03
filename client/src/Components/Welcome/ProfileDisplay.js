import React, {useRef } from "react";
import { useEffect } from "react";
import { Form, Row, Button, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
const ProfileDisplay = (props) => {
  const idToken=useSelector((state)=>state.authenticate.idToken)
    useEffect(()=>{
        nameRef.current.value='Loading...'
        urlRef.current.value='Loading...'
        async function loadProfile() {
            const response=await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyBXPzqlI6fvUIQX7LiIqUK-vdC_dfWQ0q8`,{
                method:'POST',
                body:JSON.stringify({idToken:idToken})
            })
            const data=await response.json()
            try {
              nameRef.current.value=''
              urlRef.current.value=''
                if(response.ok){
                    console.log(data);
                    nameRef.current.value=data.users[0].displayName
                    urlRef.current.value=data.users[0].photoUrl
                }else{
                    throw new Error()
                }
                
            } catch (error) {
                alert(data.error.message)
            }
        }
        loadProfile()
        // eslint-disable-next-line
    },[])

    const nameRef=useRef()
    const urlRef=useRef()
    function setProfileHandler() {
        props.profile()
    }
    async function updateUser(e){
        e.preventDefault()
        const response=await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyBXPzqlI6fvUIQX7LiIqUK-vdC_dfWQ0q8`,{
          method:'POST',
          body:JSON.stringify({idToken:idToken,displayName:nameRef.current.value,photoUrl:urlRef.current.value,returnSecureToken:true})
        })
        const data=await response.json()
        console.log(data)
        try {
            if(response.ok){
                alert('Updated')
                props.profile()
            }else{
                throw new Error()
            }
            
        } catch (error) {
            alert(data.error.message)
        }
    }
  return (
    <Form
      class="container"
      style={{
        backgroundColor: "darkgrey",
        width: "75%",
        position: "absolute",
        zIndex: "10",
        top: "5rem",
        right: "0",
        fontWeight:'bold',
        fontSize:'larger'
      }}
      onSubmit={updateUser}
    >
        <div className=" m-3 d-flex justify-content-between">
            <h3 >Contact Details</h3>
            <Button variant='danger' type='button' onClick={setProfileHandler}>Cancel</Button>
        </div>
      <Row className='mx-2'>
        <Form.Label column lg={2}>
        <i class="fa-brands fa-github"></i> Full Name
        </Form.Label>
        <Col>
          <Form.Control type="text" placeholder="Enter Name" ref={nameRef}/>
        </Col>
        <Form.Label column lg={2}>
        <i class="fa-solid fa-globe"></i> Profile Photo URL
        </Form.Label>
        <Col>
          <Form.Control type="url" placeholder="Enter URL" ref={urlRef}/>
        </Col>
      </Row>
      <Button variant="primary" type="submit" className='m-3'>
        Update
      </Button>
    </Form>
  );
};

export default ProfileDisplay;
