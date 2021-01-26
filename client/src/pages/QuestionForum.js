import { CommentCard, NavBar } from '../components'
import { useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
import axios from '../config/axios'

export default function Forum(){
  let params = useParams()
  const [loading, setLoading] = useState(false)
  const [postData, setPostData] = useState([])
  const [answerData, setAnswerData] = useState([])
  const [inputPost, setInputPost] = useState("")
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    let post
    axios.get(`/post/${params.id}`)
      .then(({data})  => {
        post = data
        return axios.get(`/answers/${params.id}`)
      })
      .then(({data})  => {
        setPostData(post)
        setAnswerData(data)
      })
      .catch(err => {
        console.log(err)
      })
  }, [refreshKey])
  
  function handleChange(e){
    setInputPost(e.target.value)
  }

  function handleSubmit(e){
    e.preventDefault()
    setLoading(true)
    axios({
      method: 'POST',
      url: `/answers/${params.id}`,
      headers: {
        access_token: localStorage.getItem('access_token')
      },
      data: {
        description: inputPost
      }
    })
      .then(_ => {
        setRefreshKey(oldKey => oldKey + 1)
      })
      .catch(err => {
        console.log(err)
      }).finally(_ => {
        setInputPost('')
        setLoading(false)
      })
  }

  return (
    <>
      <NavBar/>
      <div className="container fluid mt-5">
        <div className="row">
          <div className="col">
            <h1 className='display-3'>{postData.question}</h1>
          </div>
        </div>
        <hr />
        <div className="row">
          <div className="col mt-3">
            {postData.description}
          </div>
          <small>#{postData.category}</small>
        </div>
        <div className="row mt-5">
          {
            answerData.map(answer => {
              return (
                <CommentCard key={answer.id} name={answer.User.nickname} comment={answer.description} PostId={params.id} AnswerId={answer.id}/> 
              )
            })
          }
          <div className="col-12 mt-3">
            <h3>Comments</h3>
            <small className='mt-2'>Add your own comments here</small>
            <form onSubmit={handleSubmit}>
            <div className="mt-4 form-floating">
              <textarea onChange={handleChange} value={inputPost} className="form-control" placeholder="Leave a comment here" id="floatingTextarea2" style={{height: "100px"}}></textarea>
            </div>
            <div className="col mt-3 mb-5">
              <button className='btn btn-primary btn-block'>Post</button>
            </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}