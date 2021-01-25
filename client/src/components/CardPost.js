import React from 'react'
import { Link } from 'react-router-dom'

export default function CardPost(props) {
  return (
    <div className="d-flex flex-column align-items-start" style={{padding:'5px',height:'80px',borderTopStyle:'solid'}}>
      <Link className="btn" to={`/posts/${props.post.id}`} style={{fontWeight:'bold',maxWidth:'100%',textOverflow:'ellipsis',whiteSpace:'nowrap',overflow:'hidden'}}>{props.post.question}</Link>
      <div style={{maxWidth:'100%',textOverflow:'ellipsis',whiteSpace:'nowrap',overflow:'hidden',fontSize:'0.8em'}}>posted at: {props.post.createdAt.split('T')[0]} , by {props.post.User.nickname}, {props.post.Answers.length} answers</div>
    </div>
  )
}
