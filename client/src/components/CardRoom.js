import React from 'react'
import { useHistory } from 'react-router-dom'
export default function CardRoom(props) {
  const history = useHistory()
  const handleClick = () => {
    history.push(`/room/${props.roomId}`)
  }
  return (
    // <div onClick={handleClick} className="btn bg-info rounded d-flex flex-column justify-items-center" style={{width:'100%',height:'50px',marginTop:'4px',marginBottom:'4px'}}>
    //   <h5>{props.roomId}</h5>
    // </div>
    <div className="card mb-3" style={{width: "300px", height: '150px', marginTop: '10px'}} onClick={handleClick}>
      <div className="row g-0">
        <div className="col-md-4">
          <img src="https://cdn.iconscout.com/icon/free/png-512/account-profile-avatar-man-circle-round-user-30452.png" className='mt-3' alt="..." style={{width:'100px'}} />
        </div>
        <div className="col-md-8">
          <div className="card-body">
            <h5 className="card-title">Room master name {props.roomId}</h5>
            <p className="card-text">Senior Developer</p>
            <p className="card-text"><small className="text-muted">javascript</small></p>
          </div>
        </div>
      </div>
    </div>
  )
}
