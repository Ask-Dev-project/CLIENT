import React from 'react'
import { useHistory } from 'react-router-dom'
export default function CardRoom(props) {
  const history = useHistory()
  const handleClick = () => {
    history.push(`/room/${props.roomId}`)
  }
  return (
    <div onClick={handleClick} className="btn bg-info rounded d-flex flex-column justify-items-center" style={{width:'100%',height:'50px',marginTop:'4px',marginBottom:'4px'}}>
      <h5>{props.roomId}</h5>
    </div>
  )
}
