import { useEffect, useRef, useState } from 'react'
import {  Link, useParams } from 'react-router-dom'
import { io } from 'socket.io-client'
import Peer from 'peerjs'
import {ChatBubbles, NavBar} from '../components'

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
  const socket = io('http://localhost:3005',{
    // withCredentials: true,
    // extraHeaders: {
    //   allow: "abcd"
    // }
  })
  const peer = new Peer(undefined,{
    host: '192.168.0.6',
    port: '3002',
    path: '/peerjs/myapp'
  })
  const peers = {}
  const [input, setInput] = useState('')
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

  function handleChange(e){
    setInput(e.target.value)
  }

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

  function send(){
    console.log(input, ' sent')
    setInput('')
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
      <NavBar></NavBar>
      <div className='container-fluid'>
      <div className="ml-3">
        <div className="row mt-5">
          <div className="col-3">
            <div class="mb-3" style={{maxWidth: "540px"}}>
              <div class="row g-0">
                <div class="col-md-4">
                  <img src="https://www.searchpng.com/wp-content/uploads/2019/02/Profile-ICon.png" style={{width:'150px'}} alt="..." />
                </div>
                <div class="col-md-8">
                  <div class="card-body">
                    <h5 class="card-title">Alexander</h5>
                    <p class="card-text">Junior developer</p>
                    <p class="card-text"><small class="text-muted">javascript</small></p>
                  </div>
                </div>
              </div>
            </div>
            <div className='row'>
          <ul>
            <ChatBubbles typer='him' msg='yes whats up'></ChatBubbles>
            <ChatBubbles typer='me' msg='nothing much'></ChatBubbles>
            <ChatBubbles typer='him' msg='crazy bastard'></ChatBubbles>
            <ChatBubbles typer='me' msg='wtf bro'></ChatBubbles>
          </ul>
        </div>
        <div className="footer mt-auto py-3 bg-light">
        <div className="container-fluid">
          <div className='row'>
            <div className="col-8 form-floating">
              <textarea value={input} onChange={handleChange} class="form-control" placeholder="Leave a comment here" id="floatingTextarea2" style={{height: "100px"}}></textarea>
              <label for="floatingTextarea2">Comments</label> 
            </div>
            <div className='col-1'>
              <button type='submit' onClick={send} className='btn btn-primary mr-5 mt-5'>send</button>
            </div>
          </div>
        </div>
      </div>
          </div>
          <div className='col-9'>
            <div className='container-fluid'>
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
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  )
}

export default Room