import React from 'react'
import { Link } from 'react-router-dom'

export default function CardPost(props) {
  return (
    // <div className="d-flex flex-column align-items-start" style={{padding:'5px',height:'80px',borderBottomStyle:'solid'}}>
    //   <Link className="btn" to={`/posts/${props.post.id}`} style={{fontWeight:'bold',maxWidth:'100%',textOverflow:'ellipsis',whiteSpace:'nowrap',overflow:'hidden'}}>{props.post.question}</Link>
    //   <div style={{maxWidth:'100%',textOverflow:'ellipsis',whiteSpace:'nowrap',overflow:'hidden',fontSize:'0.8em'}}>posted at: {props.post.createdAt.split('T')[0]} , by {props.post.User.nickname}, {props.post.Answers.length} answers</div>
    // </div>
          <div class="card col- mr-3 ml-3 mt-3" style={{width: "18rem"}}>
            <div class="card-body">
            <Link className="btn card-title" to={`/posts/${props.post.id}`} style={{fontWeight:'bold',maxWidth:'100%',textOverflow:'ellipsis',whiteSpace:'nowrap',overflow:'hidden'}}>{props.post.question}</Link>
              <h6 class="card-subtitle mb-2 text-muted">posted at: {props.post.createdAt.split('T')[0]} , by {props.post.User.nickname}, {props.post.Answers.length} answers</h6>
            </div>
          </div>
  )
}
