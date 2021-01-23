import { useEffect, useRef } from 'react'
import {  Link, useParams } from 'react-router-dom'
import { io } from 'socket.io-client'
import Peer from 'peerjs'


function Room(){
  const params = useParams()
  const videoRef = useRef()
  const partnerVideoRef = useRef()
  let otherUserId;
  const socket = io('http://localhost:3005',{
    withCredentials: true,
    extraHeaders: {
      allow: "abcd"
    }
  })
  const peer = new Peer(undefined,{
    host: '/',
    port: '3001'
  })
  const peers = {}

  useEffect(() => {
    socket.on('user-connected', userId => {
      otherUserId = userId
    })
    socket.on('listUser',payload => {
      console.log(payload);
    })
    socket.on('user-disconnect', userId => {
      if(peers[userId]) peers[userId].close()
    })
    socket.on('stop-sharing', () => {
      partnerVideoRef.current.srcObject = null
    })
    
    peer.on('open', id => {
      socket.emit('join-room', params.id, id)
    })
    peer.on('call', call => {
      call.answer(videoRef.current.srcObject)
      call.on('stream', otherVideoStream => {
        partnerVideoRef.current.srcObject = otherVideoStream
      })
    })

  },[])

  const startSharing = () => {
    const videoObj = videoRef.current
    navigator.mediaDevices.getDisplayMedia({ video: true, audio: true})
      .then( stream => {
        videoObj.srcObject = stream
        stream.oninactive  = () => {
          videoObj.srcObject = null
          socket.emit('stop-sharing',params.id)
        }

        socket.on('user-connected', payload => {
          connectToNewuser(payload,stream)
        })

      })
      .catch( err => console.log(err))
  }
  const stopSharing = () => {
    videoRef.current.srcObject = null
  }

  const connectToNewuser = () => {
    let userId = otherUserId
    console.log(userId);
    let stream = videoRef.current.srcObject
    const call = peer.call(userId,stream)
    call.on('stream', userVideoStream => {
      partnerVideoRef.current.srcObject = userVideoStream
    })
    call.on('close', () => {
      partnerVideoRef.current.srcObject = null
    })
    peers[userId] = call
  }

  return(
    <>
      <div>Room</div>
      <Link to="/">home</Link>
      <button onClick={startSharing}>start</button>
      <button onClick={stopSharing}>stop</button>
      <button onClick={connectToNewuser}> call</button>
      <button onClick={()=> {
        console.log(videoRef);
      }}>test</button>
      <div className="container">
        <video ref={ videoRef } style={{ height: '300px', width: '300px', backgroundColor: 'grey'}} muted autoPlay></video>
        <video ref={ partnerVideoRef } style={{ height: '300px', width: '300px', backgroundColor: 'blueviolet'}} muted autoPlay></video>
      </div>
    </>
  )
}

export default Room