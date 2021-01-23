import { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { io } from 'socket.io-client'
// import Peer from 'peerjs'


function Room(){
  let params = useParams()
  const [ownId, setOwnId ] = useState()
  const userVideo = useRef();
  const partnerVideo = useRef();
  const peerRef = useRef();
  const otherUser = useRef();
  const userStream = useRef();
  
  const socket = io('http://localhost:3005',{
    withCredentials: true,
    extraHeaders: {
      allow: "abcd"
    }
  })
  
  useEffect(() => {
    socket.emit('join-room',params.id)
    return () => {
      socket.emit('leave-room',params.id)
    }
    // eslint-disable-next-line
  },[])

  

  const makeCall = (userId) => {
    peerRef.current = makePeer(userId)
    console.log(peerRef)
    userStream.current.getTracks().forEach( track => peerRef.current.addTrack(track, userStream.current))
    console.log(peerRef)
  }

  const handleReceiveCall = info => {
    console.log('handle receive call');
    peerRef.current = makePeer()
    const desc = new RTCSessionDescription(info.sdp)
    peerRef.current.setRemoteDescription(desc)
      .then(_=>{
        userStream.current.getTracks().forEach(track => peerRef.current.addTrack(track, userStream.current))
      })
      .then(_=>{
        return peerRef.current.createAnswer()
      })
      .then(answer=>{
        return peerRef.current.setLocalDescription(answer)
      })
      .then(_=> {
        const payload = {
          target: info.caller,
          caller: ownId,
          sdp: peerRef.current.localDescription
        }
        socket.emit('answer',payload)
      })
      .catch(err => {
        console.log(err, 'handle receive call');
      })
  }

  const handleAnswer = payload => {
    console.log('handle answer');
    const desc = new RTCSessionDescription(payload.sdp)
    peerRef.current.setRemoteDescription(desc)
      .catch(err => console.log(err, 'handle answer'))
  }

  const startSharing = () => {
    navigator.mediaDevices.getDisplayMedia({ video: true, audio: true})
      .then( stream => {
        userVideo.current.srcObject = stream
        userStream.current = stream
      })
      .catch(err => {
        console.log(err, 'start hsaring');
      })
    // if(otherUser){
    //   socket.emit('sharing',params.id)
    //   navigator.mediaDevices.getDisplayMedia({ video: true, audio: true})
    //     .then(handleSuccess, handleError)
    // }
  }

  const handleIceCandidate = e => {
    console.log('1');
    if (e.candidate) {
      const payload = {
          target: otherUser.current,
          candidate: e.candidate,
      }
      socket.emit('ice-candidate',payload)
    }
  }

  const handleNegotiation = userId => {
    console.log('2');
    peerRef.current.createOffer()
      .then( offer => {
        return peerRef.current.setLocalDescription(offer)
      })
      .then(_=>{
        const payload = {
          target: userId,
          caller: ownId,
          sdp: peerRef.current.localDescription
        }
        socket.emit('offer',payload)
      })
      .catch(err => {
        console.log(err, 'dari handle negotiation');
      })
  }

  const makePeer = userId => {
    console.log('3');
    const peerConnection = new RTCPeerConnection({ iceServers: [
      { urls: "stun:stun.stunprotocol.org"},
      { urls: 'turn:numb.viagenie.ca',credential: 'muazkh',username: 'webrtc@live.com'}]})
    
    peerConnection.onicecandidate = handleIceCandidate
    peerConnection.ontrack = handleTrackEvent
    peerConnection.onnegotiationneeded = () => handleNegotiation(userId)

    return peerConnection
  }

  function handleTrackEvent(e) {
    console.log('4');
    console.log(e.streams[0], '<<< track event');
    partnerVideo.current.srcObject = e.streams[0];
  }

  const handleSuccess = (stream) => {
    // const call = peer.current.call(otherUser,stream)
    // call.on('stream', otherStream => {
    //   const partnerVideo = document.querySelector('video')
    //   partnerVideo.srcObject = otherStream
    //   otherStream.getVideoTracks()[0].addEventListener('ended', () => {
    //     console.log('ended');
    //     partnerVideo.srcObject = null
    //   })
    // })
  }

  const handleError = (stream) => {
    console.log(stream.name);
  }

  const stopSharing = () => {
    document.querySelector('video').srcObject = null
  }

  socket.on('offer',handleReceiveCall)
  socket.on('answer',handleAnswer)
  
  socket.on('someone-leave', payload => {
    console.log(payload);
  })

  socket.on('socket-id', id => {
    setOwnId(id)
  })

  socket.on('other-join', otherId => {
    console.log(otherId);
    otherUser.current = otherId
  })

  socket.on('someone-sharing', () => {
    console.log('ada yang sharing')
  })

  return(
    <>
      <div>Room</div>
      <Link to="/">home</Link>
      <button onClick={startSharing}>start</button>
      <button onClick={stopSharing}>stop</button>
      <video ref={userVideo} autoPlay style={{ width: '300px', height: '300px',backgroundColor: 'green'}} ></video>
      <video ref={partnerVideo} autoPlay style={{ width: '300px', height: '300px',backgroundColor: 'red'}} ></video>
      <button onClick={()=> makeCall(otherUser.current)}>make call</button>
      <button onClick={() => {
        console.log(userVideo,partnerVideo,userStream);
      }}>log</button>
    </>
  )
}

export default Room