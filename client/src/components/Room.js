import { useEffect, useRef, useState } from 'react'
import {  Link, useParams } from 'react-router-dom'
import { io } from 'socket.io-client'
import Peer from 'peerjs'


function Room(){
  const params = useParams()
  const videoRef = useRef()
  const audioRef = useRef()
  const partnerVideoRef = useRef()
  // const partnerAudioRef = useRef()
  const ownPeerId = useRef()
  const otherUserId = useRef()
  const [ownVideoStart, setOwnVideoStart] = useState(false)
  const [partnerVideoStart, setPartnerVideoStart] = useState(false)
  const socket = io('http://192.168.0.6:3005',{
    // withCredentials: true,
    // extraHeaders: {
    //   allow: "abcd"
    // }
  })
  const peer = new Peer(undefined)
  const peers = {}

  useEffect(() => {
    socket.on('user-connected', userId => {
      otherUserId.current = userId
      socket.emit('give-my-id',{ownPeerId: ownPeerId.current,roomId:params.id})
    })
    socket.on('listUser',payload => {
      console.log(payload);
    })
    socket.on('user-disconnect', userId => {
      if(peers[userId]) peers[userId].close()
      console.log(userId, '<<< userId')
    })
    socket.on('stop-sharing', () => {
      partnerVideoRef.current.srcObject.getTracks().forEach(track => {
        track.stop()
      })
      partnerVideoRef.current.srcObject = null
      // partnerAudioRef.current.srcObject = null
      setPartnerVideoStart(false)
    })
    socket.on('give-other-id',otherId => {
      otherUserId.current = otherId
    })
    
    peer.on('open', id => {
      ownPeerId.current = id
      let jwt = localStorage.getItem('access_token')
      socket.emit('join-room', params.id, id,jwt)
    })
    peer.on('call', call => {
      navigator.mediaDevices.getDisplayMedia({video:false,audio:false})
        .then( stream => {
          videoRef.current.srcObject = stream
          return navigator.mediaDevices.getUserMedia({video:false,audio:true})
        })
        .then( audioStream => {
          console.log(audioStream);
          let audioTrack = audioStream.getAudioTracks()[0]
          videoRef.current.srcObject.addTrack(audioTrack)
          console.log(videoRef.current.srcObject.getVideoTracks());
          videoRef.current.srcObject.getVideoTracks()[0].onended = () => {
            videoRef.current.srcObject.getTracks().forEach(track => {
              track.stop()
            })
            videoRef.current.srcObject = null
            socket.emit('stop-sharing',params.id)
            setOwnVideoStart(false)
          }
          call.answer(videoRef.current.srcObject)
          call.on('stream', otherVideoStream => {
            partnerVideoRef.current.srcObject = otherVideoStream
            // partnerAudioRef.current.srcObject = otherVideoStream.audioStream
            setPartnerVideoStart(true)
          })
        })
    })

    return () => socket.disconnect()

    // eslint-disable-next-line
  },[])

  const startSharing = () => {
    navigator.mediaDevices.getDisplayMedia({ video: true })
    .then( stream => {
      videoRef.current.srcObject = stream
      setOwnVideoStart(true)
      return navigator.mediaDevices.getUserMedia({video:false,audio:true})
    })
    .then( audioStream => {
      let audioTrack = audioStream.getAudioTracks()[0]
      videoRef.current.srcObject.addTrack(audioTrack)
      videoRef.current.srcObject.getVideoTracks()[0].onended = () => {
        videoRef.current.srcObject.getTracks().forEach(track => {
          track.stop()
        })
        videoRef.current.srcObject = null
        socket.emit('stop-sharing',params.id)
        setOwnVideoStart(false)
      }
      // videoRef.current.srcObject.oninactive  = () => {
      //   console.log('oninactive');
      //   videoRef.current.srcObject.getTracks().forEach(track => {
      //     track.stop()
      //   })
      //   videoRef.current.srcObject = null
      //   socket.emit('stop-sharing',params.id)
      //   setOwnVideoStart(false)
      // }
        // audioRef.current.srcObject = audioStream
        if(otherUserId.current){
          connectToNewuser()
        }
      })
      .catch( err => console.log(err))
  }
  const stopSharing = () => {
    videoRef.current.srcObject = null
    audioRef.current.srcObject = null
  }

  const connectToNewuser = () => {
    let userId = otherUserId.current
    let stream = videoRef.current.srcObject
    // let audioStream = audioRef.current.srcObject
    const call = peer.call(userId,stream)
    call.on('stream', userVideoStream => {
      partnerVideoRef.current.srcObject = userVideoStream
      // partnerAudioRef.current.srcObject = userVideoStream.audioStream
    })
    call.on('close', () => {
      partnerVideoRef.current.srcObject = null
      // partnerAudioRef.current.srcObject = null
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
        console.log(ownPeerId);
        console.log(otherUserId);
      }}>test</button>
      <div className="container">
        <video ref={ videoRef } hidden={!ownVideoStart} style={{ height: '300px', width: '300px', backgroundColor: 'grey'}} autoPlay></video>
        <video ref={ partnerVideoRef } hidden={!partnerVideoStart} style={{ height: '300px', width: '300px', backgroundColor: 'blueviolet'}} autoPlay></video>
        {/* <audio ref={audioRef} autoPlay></audio>
        <audio ref={partnerAudioRef} autoPlay></audio> */}
      </div>
    </>
  )
}

export default Room