import { Button } from "react-bootstrap";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { ResponseGoogle } from "../components";
import GitHubLogin from "react-github-login";
import axios from "axios";

const serverUrl = `http://localhost:3005`

export default function NavBar() {
  const [isLogin,setIsLogin] = useState(false)
  const githubLogin = async () => {
    try {
      await axios({
        method: "GET",
        url: `${serverUrl}/user/githubLogin`,
      });
    } catch (error) {
      console.log(error);
    }
  };
  const onSuccess = (res) => {
    axios.get(`${serverUrl}/user/oauth-callback?code=${res.code}`)
      .then(data => {
        console.log(data)
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
        activeStyle={{ fontWeight: "bold" }}
        className="btn navbar-brand"
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
          {/* <button>
          Github
        </button> */}

          {/* <Button className="btn" onClick={githubLogin}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-github"
              viewBox="0 0 16 16"
            >
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
            </svg>
            github
          </Button> */}

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
