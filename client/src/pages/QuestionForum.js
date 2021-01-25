import { CommentCard, NavBar } from '../components'

export default function Forum(){
  return (
    <>
      <NavBar/>
      <div className="container fluid mt-5">
        <div className="row">
          <div className="col">
            <h1 className='display-3'>How do you code?</h1>
          </div>
        </div>
        <hr />
        <div className="row">
          <div className="col mt-3">
            So, i just started to code and have no idea on how to code properly
          </div>
          <small>#javascript</small>
        </div>
        <div className="row mt-5">
            <CommentCard name='Erick' role='Senior developer' comment='Better join hacktiv8 bro'/> 
          <div className="col-12 mt-3">
            <h3>Comments</h3>
            <small className='mt-2'>Add your own comments here</small>
            <div className="mt-4 form-floating">
              <textarea className="form-control" placeholder="Leave a comment here" id="floatingTextarea2" style={{height: "100px"}}></textarea>
            </div>
          </div>
          <div className="col mt-3 mb-5">
            <button className='btn btn-primary btn-block'>Post</button>
          </div>
        </div>
      </div>
    </>
  )
}