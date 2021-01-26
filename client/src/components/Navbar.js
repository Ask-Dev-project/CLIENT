import { Button } from "react-bootstrap";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { ResponseGoogle } from "../components";
import GitHubLogin from "react-github-login";
import axios from '../config/axios'


export default function NavBar() {
  const [isLogin,setIsLogin] = useState(false)
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
  return (
    <nav
      className="navbar navbar-expand-lg justify-content-center"
      style={{ backgroundColor: "#3399FF" }}
    >
      <NavLink
        exact
        to="/"
        activeStyle={{ textDecoration: "underline" }}
        className="btn"
      >
        Home
      </NavLink>
      <h2
        style={{ fontWeight: "bold", marginLeft: "500px", marginRight: "auto" }}
      >
        AskDev
      </h2>
      <div
        className="rounded bg-danger ml-auto p-0 d-flex"
        style={{ height: "50px", width: "200px" }}
      >
        <br></br>
        <ResponseGoogle className="g-signin2" />

        <div
          className="bg-primary rounded"
          style={{
            height: "80%",
            width: "40%",
            marginLeft: "5px",
            marginTop: "3px",
          }}
        >

          <GitHubLogin
            clientId="07b7bf9b0666de61261d"
            buttonText="Github"
            onSuccess={onSuccess}
            onFailure={onFailure}
            valid={true}
            redirectUri="http://localhost:3000"
          />
        </div>
      </div>
    </nav>
  );
}
