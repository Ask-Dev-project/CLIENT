import { Button, Nav, Modal, Form } from 'react-bootstrap'
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { ResponseGoogle } from "../components";
import GitHubLogin from "react-github-login";
import axios from '../config/axios'

export default function NavBar() {
  const [isLogin,setIsLogin] = useState(false)
  const [show, setShow] = useState(false);
  const [inputModal, setInputModal] = useState({
    question: '',
    description: '',
    category:''
  })

  const onSuccess = (res) => {
    console.log(res.code);
    axios.get(`/user/oauth-callback?code=${res.code}`)
      .then(({data}) => {
        console.log(data);
        localStorage.setItem('access_token', data.access_token)
        localStorage.setItem('nickname', data.nickname)
      })
      .catch(err => {
        console.log(err)
      })
  };
  const onFailure = (response) => console.error(response);

  function handleChange(e){
    setInputModal({...inputModal, [e.target.name]: e.target.value})
  }

  function handleClose(status){
    setShow(false);
    if (status === 'save-post'){
      console.log(inputModal, '<<')
      axios({
        method: 'POST',
        url: `/post`,
        data: {
          question: inputModal.question,
          description: inputModal.description,
          category: inputModal.category
        },
        headers: {
          access_token: localStorage.getItem('access_token')
        }
      })
        .then(_ => {
          console.log('berhasil')
        })
        .err(err => {
          console.log(err)
        })
    } 
  }
    function handleShow(){
    setShow(true);

  } 


  return (

    <nav className="navbar navbar-expand-lg justify-content-center" style={{backgroundColor:'#3399FF'}}>
      <NavLink exact to="/" activeStyle={{textDecoration:'underline'}} className="btn">
      <svg xmlns="http://www.w3.org/2000/svg" width="100" height="30" fill="currentColor" class="bi bi-house-fill" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M8 3.293l6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293l6-6zm5-.793V6l-2-2V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5z"/>
  <path fill-rule="evenodd" d="M7.293 1.5a1 1 0 0 1 1.414 0l6.647 6.646a.5.5 0 0 1-.708.708L8 2.207 1.354 8.854a.5.5 0 1 1-.708-.708L7.293 1.5z"/>
</svg>
      </NavLink>
      <Button variant="success" onClick={handleShow}>
        Ask Q?
      </Button>

      <Modal centered show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>AskDev</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
            <Form.Group controlId="formBasicEmail">
                <Form.Label>Question</Form.Label>
                <Form.Control type="text" name="question" value={inputModal.question} onChange={handleChange} placeholder="Input Question" />
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" name="description" value={inputModal.description} onChange={handleChange} placeholder="Input Description" />
            </Form.Group>
            <Form.Group controlId="exampleForm.ControlSelect1">
              <Form.Label>Select category</Form.Label>
              <Form.Control as="select" custom name="category" onChange={handleChange}>
                <option value="Javascript">Javascript</option>
                <option value="Python">Python</option>
                <option value="Java">Java</option>
                <option value="C++">C++</option>
                <option value="C#">C#</option> 
              </Form.Control>
          </Form.Group>
            <Modal.Footer>
            <Button variant="secondary" onClick={() => handleClose('close')}>
                Close
            </Button>
            <Button variant="primary" onClick={() => handleClose('save-post')}>
                Post
            </Button>
            </Modal.Footer>
            </Form>
            </Modal.Body>
      </Modal>
      <h2 style={{fontWeight:'bold',marginLeft:'500px',marginRight:'auto'}}>AskDev</h2>
      <h4 style={{fontWeight:'bold',height:'20px',  marginRight:'5px'}}>Login With:</h4> 
      <Nav>
      <Nav.Link>
      <ResponseGoogle style={{height:'auto'}} />
      </Nav.Link>

      <Nav.Link href="/github">
      <Button variant="dark" style={{height:'44px'}} >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-github" viewBox="0 0 16 16">
  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
</svg>github
</Button>
      </Nav.Link>
      
      </Nav>
    </nav>
  );
}
