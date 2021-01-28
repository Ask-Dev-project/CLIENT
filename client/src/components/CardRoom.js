import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import {Button} from 'react-bootstrap'
import axios from '../config/axios'
export default function CardRoom(props) {
  const [isRoomFull,setIsRoomFull] = useState(false)
  const history = useHistory()
  const handleClick = () => {
    if(localStorage.getItem('access_token')){
      axios.get('/listRoom')
        .then(({data}) => {
          if(data[props.roomId]){
            if(Object.keys(data[props.roomId]).length === 2){
              setIsRoomFull(true)
            }else{
              history.push(`/room/${props.roomId}`)
            }
          }else{
            history.push(`/room/${props.roomId}`)
          }
        }).catch(err => console.log(err))
    }
  }

  useEffect(() => {
    axios.get('/listRoom')
      .then(({data}) => {
        if(data[props.roomId]){
          if(Object.keys(data[props.roomId]).length === 2){
            setIsRoomFull(true)
          }
        }
      })
  },[])

  return (
    <div className="card mb-3 rounded-pill" style={{width: "95%", minHeight: '100px', marginTop: '10px'}} onClick={handleClick}>
      <div className="row g-0">
        <div className="col-md-3 ">
          <span> </span>
          
        </div>
        <div className="col-md-8 ml-2">
          <div className="card-body">
            <h6 className="card-title">Room {props.roomId}</h6>
            {
              isRoomFull ? 
              <p className="card-text"><small className="text-muted">room is full</small></p>
              :
              <Button className="mb-12 ml-2 rounded-pill" style={{width:"100%"}}  onClick={handleClick} >Join</Button>
            }
            <span></span> 
            
          </div>
        </div>
      </div>
    </div>
    
    
  )
}
