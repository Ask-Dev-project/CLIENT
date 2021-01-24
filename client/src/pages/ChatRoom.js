import NavBar from '../components/NavBar'
import { useState } from 'react'

export default function ChatRoom() {
  const [input, setInput] = useState('')
  
  function handleChange(e){
    setInput(e.target.value)
  }

  function send(){
    console.log(input, ' sent')
    setInput('')
  }

  return (
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
            <li class="him">
            This is some text within a card body.       
            </li>
            <li class="me">By this User, first message</li>
            <li class="me">By this User, secondmessage</li>
            <li class="me">By this User, third message</li>
            <li class="me">By this User, fourth message</li>
            <li class="me">By this User, fifth message</li>
            <li class="me">By this User, sixth message</li>
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
              <p>untuk screen share</p>
            </div>
          </div>
        </div>
        
      </div>
     
      </div>
    </>
  )
}