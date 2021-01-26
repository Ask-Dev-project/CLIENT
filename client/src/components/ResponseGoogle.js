import React from 'react'
import { GoogleLogin } from 'react-google-login'

const ResponseGoogle = (res) => {
console.log(res);
// console.log(res.profileObj);
  
}

const GoogleButton = () => {

  return (
    <div>
    <GoogleLogin
    clientId="859682134010-sgait0v7tvesgcq0voj0ntqi8km0j692.apps.googleusercontent.com"
    buttonText="Sign in"
    onSuccess={ResponseGoogle}
    onFailure={ResponseGoogle}
    cookiePolicy={'single_host_origin'}
    />
    </div>
  )
}
export default GoogleButton