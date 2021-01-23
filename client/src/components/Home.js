// import React, { useEffect, useState, useRef, Suspense } from 'react';
// import io from 'socket.io-client'
// import Peer from 'simple-peer'
import { Link } from 'react-router-dom'


function Home() {

  return(
    <>
      <div className="container justify-content-center">Home</div>
      <Link to="/room/1">room</Link>  
    </>
  )
}
  
export default Home;