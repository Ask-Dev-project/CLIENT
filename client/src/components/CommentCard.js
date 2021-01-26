import { Modal, Form, Button, NavLink} from 'react-bootstrap'
import { useState } from 'react'
import axios from 'axios'

export default function CommentCard(props) {
  const [show, setShow] = useState(false);
  const [showDeleteModal, setDeleteModalShow] = useState(false);
  const [comment, setComment] = useState('')
  
  function handleClose(status){
    if(status === 'save-edit'){
      axios({
        method: 'POST',
        url: `http://localhost:3005/${props.PostId}/${props.AnswerId}`,
        data: {
          description: comment
        }
      })
        .then(_ => {
          setShow(false);
        })
        .catch(err => {
          console.log(err)
        })
    } else {
      setShow(false);
    }
  } 

  function handleShow(e){
    e.preventDefault()
    axios.get(`http://localhost:3005/answers/${props.PostId}/${props.AnswerId}`)
      .then(({data}) => {
        setComment(data)
        setShow(true);
      })
      .catch(err => {
        console.log(err)
      })
  }
  function handleChange(e){
    setComment(e.target.value)
  }

  function handleCloseDelModal(){
    setDeleteModalShow(false);
  }

  function handleShowDelModal(){
    setDeleteModalShow(true);
  } 
  
  return(
    <>
    <div className='col-12 mt-2'>
    <div className="card border-dark mb-3" style={{maxWidth: "100rem"}}>
    <a href="#delete" onClick={handleShowDelModal}><i className="fa fa-trash-o" style={{fontSize:"24px", position: 'absolute', right:'70px', top:'8px'}}></i></a>
    <Modal centered show={showDeleteModal} onHide={handleCloseDelModal}>
        <Modal.Header closeButton>
          <Modal.Title style={{color:'red'}}>Notifications!</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are You Sure?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDelModal}>
            No
          </Button>
          <Button variant="primary" onClick={handleCloseDelModal}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    <a href="#edit" onClick={handleShow}><i className="fa fa-pencil-square-o" style={{fontSize:"24px", position: 'absolute', right:'16px', top:'10px'}}></i></a>
      <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
            <Modal.Title>Action</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form>
            <Form.Group controlId="formBasicEmail">
                <Form.Label>Edit Your Comment</Form.Label>
                <Form.Control as="textarea" name="comment" value={comment.description} onChange={handleChange} placeholder="Input Title" />
            </Form.Group>
            <Modal.Footer>
            <Button variant="secondary" onClick={() => handleClose('close')}>
                Close
            </Button>
            <Button variant="primary" onClick={() => handleClose('save-edit')}>
                Save
            </Button>
            </Modal.Footer>
            </Form>
            </Modal.Body>
        </Modal>

      <div className="card-header">{props.name}</div>
        <div className="card-body text-dark">
          <h5 className="card-title">{props.role}</h5>
        <p className="card-text">{props.comment}</p>
      </div>
    </div>
    </div>
    </>
  )
}