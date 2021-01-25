import React from 'react'
import { NavLink } from 'react-router-dom'

export default function NavBar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light justify-content-center">
      <NavLink exact to="/" activeStyle={{textDecoration:'underline'}} className="btn">Home</NavLink>
      <h2 style={{fontWeight:'bold',marginLeft:'500px',marginRight:'auto'}}>AskDev</h2>
      <div className="rounded bg-danger ml-auto p-0 d-flex" style={{height:'60px',width:'200px'}}>
        <div className="bg-success rounded" style={{height:'80%',width:'50%',marginTop:'3px'}}>
          <p>foto profil</p>
        </div>
        <div className="bg-primary rounded" style={{height:'80%',width:'40%',marginLeft:'5px',marginTop:'3px'}}>
          <p>nickname user</p>
        </div>
      </div>
    </nav>
  )
}
