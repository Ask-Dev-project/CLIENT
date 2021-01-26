import React from 'react'
import { useHistory } from 'react-router-dom'
import {Button} from 'react-bootstrap'
export default function CardRoom(props) {
  const history = useHistory()
  const handleClick = () => {
    history.push(`/room/${props.roomId}`)
  }
  return (
    // <div onClick={handleClick} className="btn bg-info rounded d-flex flex-column justify-items-center" style={{width:'100%',height:'50px',marginTop:'4px',marginBottom:'4px'}}>
    //   <h5>{props.roomId}</h5>
    // </div>

    <div className="card mb-1" style={{width: "300px"}} >
      <div className="row g-0">
        <div className="col-md-3 ">
          <img src="https://cdn.iconscout.com/icon/free/png-512/account-profile-avatar-man-circle-round-user-30452.png" className='mt-3' alt="..." style={{width:'100px'}} />
          <span> </span>
          
        </div>
        <div className="col-md-8">
          <div className="card-body">
            <h6 className="card-title">Room master name {props.roomId}</h6>
            <p className="card-text"><small className="text-muted">javascript</small></p>
            <Button className="mb-12 " style={{width:"100px"}}  onClick={handleClick} >Join</Button>
            <span></span> 
            
          </div>
        </div>
      </div>
    </div>
    
    
  )
}
