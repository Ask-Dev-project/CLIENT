import { useEffect, useRef, useState } from 'react'
import {  useParams } from 'react-router-dom'
import io from 'socket.io-client'
import Peer from 'peerjs'
import {ChatBubbles, NavBar} from '../components'

// const chats = [
//   {
//     owner: 'me',
//     message: 'hello'
//   },
//   {
//     owner: 'him',
//     message: 'world'
//   },
//   {
//     owner: 'me',
//     message: '?'
//   },
//   {
//     owner: 'him',
//     message: '?'
//   }
// ]

function Room(){
  const params = useParams()
  const videoRef = useRef()
  const partnerVideoRef = useRef()
  const socketRef = useRef()
  const ownPeerId = useRef()
  const otherUserId = useRef()
  const [ownVideoStart, setOwnVideoStart] = useState(false)
  const [partnerVideoStart, setPartnerVideoStart] = useState(false)

  const [allChat,setAllChat] = useState([])
  console.log(allChat, '<< top level');
  // const socket = io('http://localhost:3005')

  const peer = new Peer(undefined)
  const peers = {}
  const [input, setInput] = useState('')

  const handleNewChat = (message) => {
    let newBubbleChat = {
      owner: 'him',
      message: message
    }
    console.log(allChat,'<<<<< all'); // []
    let newArr = allChat.concat(newBubbleChat) // [...allChat,newBubbleChat]
    console.log(newArr) // [{...}]
    setAllChat(() => {
      return newArr
    })
    console.log(allChat,'<<< setelah set');
  }

  const forceStopSharing = () => {
    if(ownVideoStart){
      videoRef.current.srcObject.getTracks().forEach( track => {
        track.stop()
      })
    }
    if(partnerVideoStart){
      partnerVideoRef.current.srcObject.getTracks().forEach( track => {
        track.stop()
      })
    }
  }

  useEffect(()=>{
    console.log(allChat,'<<< dari use effect')
  },[allChat])

  useEffect(() => {
    socketRef.current = io.connect('http://localhost:3005')
    socketRef.current.on('user-connected', userId => {
      otherUserId.current = userId
      socketRef.current.emit('give-my-id',{ownPeerId: ownPeerId.current,roomId:params.id})
    })
    socketRef.current.on('receive-chat',message => {
      console.log(allChat, '<<< dari receive');
      handleNewChat(message)
    })
    socketRef.current.on('listUser',payload => {
      console.log(payload);
    })
    socketRef.current.on('user-disconnect', userId => {
      if(peers[userId]) peers[userId].close()
      console.log(userId, '<<< userId')
    })
    socketRef.current.on('stop-sharing', () => {
      partnerVideoRef.current.srcObject.getTracks().forEach(track => {
        track.stop()
      })
      partnerVideoRef.current.srcObject = null
      setPartnerVideoStart(false)
    })
    socketRef.current.on('give-other-id',otherId => {
      otherUserId.current = otherId
    })
    
    peer.on('open', id => {
      ownPeerId.current = id
      let jwt = localStorage.getItem('access_token')
      socketRef.current.emit('join-room', params.id, id,jwt)
    })
    peer.on('call', call => {
      navigator.mediaDevices.getDisplayMedia({video:false,audio:false})
        .then( stream => {
          videoRef.current.srcObject = stream
          return navigator.mediaDevices.getUserMedia({video:false,audio:true})
        })
        .then( audioStream => {
          let audioTrack = audioStream.getAudioTracks()[0]
          videoRef.current.srcObject.addTrack(audioTrack)
          videoRef.current.srcObject.getVideoTracks()[0].onended = () => {
            // videoRef.current.srcObject.getTracks().forEach(track => {
            //   track.stop()
            // })
            forceStopSharing()
            if(videoRef.current){
              videoRef.current.srcObject = null
            }
            socketRef.current.emit('stop-sharing',params.id)
            setOwnVideoStart(false)
          }
          call.answer(videoRef.current.srcObject)
          call.on('stream', otherVideoStream => {
            partnerVideoRef.current.srcObject = otherVideoStream
            setPartnerVideoStart(true)
          })
        })
    })

    return () =>{
      socketRef.current.disconnect()
      forceStopSharing()
    } 

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
        // videoRef.current.srcObject.getTracks().forEach(track => {
        //   track.stop()
        // })
        forceStopSharing()
        if(videoRef.current){
          videoRef.current.srcObject = null
        }

        socketRef.current.emit('stop-sharing',params.id)
        setOwnVideoStart(false)
      }
        if(otherUserId.current){
          connectToNewuser()
        }
      })
      .catch( err => console.log(err))
  }

  function send(){
    let newBubble = {
      owner: 'me',
      message: input
    }
    let newObj = {
      roomId : params.id,
      message: input
    }
    socketRef.current.emit('send-chat',newObj)
    setAllChat([...allChat,newBubble])
    setInput('')
  }

  const connectToNewuser = () => {
    let userId = otherUserId.current
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
      <NavBar></NavBar>
      <div className='container-fluid'>
      <div className="ml-3">
        <div className="row mt-1">
          <div className="col-3">
            <div className="mb-3" style={{maxWidth: "540px"}}>
              <div className="row g-0">
                <div className="col-md-4">
                  <img src="https://www.searchpng.com/wp-content/uploads/2019/02/Profile-ICon.png" style={{width:'90px'}} alt="..." />
                </div>
                <div className="col-md-8">
                  <div className="card-body">
                    <h5 className="card-title">Alexander</h5>
                    <p className="card-text">Junior developer</p>
                    <p className="card-text"><small className="text-muted">javascript</small></p>
                  </div>
                </div>
              </div>
            </div>
            <div className='row'>
          <ul>
            {
              allChat.map((chat) => {
                return <ChatBubbles key={chat.message} typer={chat.owner} msg={chat.message}/>
              })
            }
          </ul>
        </div>
        <div className="footer mt-auto py-3 bg-light">
        <div className="container-fluid">
          <div className='row'>
            <div className="col-8 form-floating">
              <form onSubmit={(e)=>{
                e.preventDefault()
                send()
              }}>
                <input value={input} onChange={handleChange} className="form-control" placeholder="message" id="floatingTextarea2" style={{height: "80px"}}></input>
              </form>
            </div>
            <div className='col-1'>
              <button type='submit' onClick={send} className='btn btn-primary mr-5 mt-5'>send</button>
            </div>
          </div>
        </div>
      </div>
          </div>
          <div className='col-9'>
            <div className="row justify-content-center align-items-center" style={{height:'100%'}}>
              <button className="btn btn-success" hidden={ownVideoStart || partnerVideoStart} onClick={startSharing}>start screen sharing</button>
              <button onClick={()=> {
                console.log(ownPeerId);
                console.log(otherUserId);
                console.log(allChat)
              }}>test</button>
                <video ref={ videoRef } hidden={!ownVideoStart} style={{ height: '90%', width: '90%', backgroundColor: 'grey'}} muted autoPlay></video>
                <video ref={ partnerVideoRef } hidden={!partnerVideoStart} style={{ height: '90%', width: '90%', backgroundColor: 'blueviolet'}} autoPlay></video>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  )
}

export default Room