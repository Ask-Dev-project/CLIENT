import React from 'react'
import { useHistory } from 'react-router-dom'

export default function CardPost(props) {
  const history = useHistory()
  const handleClickTitle = () => {
    history.push(`/posts/${props.postId}`)
  }
  return (
    <div className="d-flex flex-column align-items-start" style={{padding:'5px',height:'80px',borderTopStyle:'solid'}}>
      <button className="btn" onClick={handleClickTitle} style={{fontWeight:'bold',maxWidth:'100%',textOverflow:'ellipsis',whiteSpace:'nowrap',overflow:'hidden'}}>judul postingan</button>
      <div style={{maxWidth:'100%',textOverflow:'ellipsis',whiteSpace:'nowrap',overflow:'hidden'}}>detail siapa yang ngepost, kapan dipost nya, berapa isi jawabannya</div>
    </div>
  )
}
