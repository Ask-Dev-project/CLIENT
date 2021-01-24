export default function CommentCard(props) {
  return(
    <div className='col-12 mt-2'>
    <div class="card border-dark mb-3" style={{maxWidth: "100rem"}}>
      <div class="card-header">{props.name}</div>
        <div class="card-body text-dark">
          <h5 class="card-title">{props.role}</h5>
        <p class="card-text">{props.comment}</p>
      </div>
    </div>
    </div>
  )
}