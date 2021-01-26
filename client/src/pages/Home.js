import { Link, useLocation, NavLink } from 'react-router-dom'
import { NavBar } from '../components'
import CardPost from '../components/CardPost'
import CardRoom from '../components/CardRoom'
import { useState, useEffect } from 'react'
import axios from '../config/axios'
import LoadingSpin from '../components/LoadingSpin'

const rooms = [
  "1","2","3","4"
]
function useQuery(){
  return new URLSearchParams(useLocation().search)
}

function Home() {
  const query = useQuery()
  const [init,setInit] = useState(true)
  const [loadingPost,setLoadingPost] = useState(true)
  const [posts,setPosts] = useState([])

  useEffect(()=> {
    if(!init && query.get("category")){
      setLoadingPost(true)
      setPosts([])
      axios.get(`/post/category?name=${query.get("category")}`,{
        data:{
          category: query.get("category")
        }
      })
        .then(({data}) => {
          setPosts(data)
          setLoadingPost(false)
        }).catch(err => console.log(err))
    }else if(!query.get("category") && !init) {
      setPosts([])
      axios.get(`/post`)
      .then(({data}) => {
        setPosts(data)
        setLoadingPost(false)
        setInit(false)
      }).catch(err => console.log(err))
    }
    // eslint-disable-next-line
  },[query.get("category")])
  useEffect(()=>{
    axios.get(`/post`)
      .then(({data}) => {
        setPosts([])
        setPosts(posts.concat(data))
        setLoadingPost(false)
        setInit(false)
      }).catch(err => console.log(err))
      // eslint-disable-next-line
  },[])

  return(
    <>
      <NavBar/>
      <div className="container" style={{minWidth:'95vw',minHeight:'80vh'}}>
        <div className="row">
          <div className="col-2 " style={{minHeight:'200px'}}>
            <div className="d-flex flex-column align-items-center" style={{marginTop:'63px',width:'100%',gap:'7px'}}>
              <div class="card bg-light" style={{width: "15rem"}}>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item"><NavLink exact to="/" className="btn">Programming Language</NavLink></li>
                  <hr style={{marginTop:'-1em'}}/>
                  <li class="list-group-item"><NavLink to="?category=Javascript" className="btn">Javascript</NavLink></li>
                  <hr style={{marginTop:'-1em'}}/>
                  <li class="list-group-item"><NavLink to="?category=Python" className="btn">Python</NavLink></li>
                  <hr style={{marginTop:'-1em'}}/>
                  <li class="list-group-item"><NavLink to="?category=Java" className="btn">Java</NavLink></li>
                  <hr style={{marginTop:'-1em'}}/>
                  <li class="list-group-item"><NavLink to="?category=Cpp" className="btn">C++</NavLink></li>
                  <hr style={{marginTop:'-1em'}}/>
                  <li class="list-group-item"><NavLink to="?category=Cs" className="btn">C#</NavLink></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-10">
            <div className="row">
              <h2 className='display-4 ml-5'>FORUM posting</h2>
            </div>
            <div className="row">
              <div className="col-9" style={{minHeight:'200px'}}>
                <div className='container'>
                  <div className='row'>
                {
                  loadingPost ?
                  <LoadingSpin/>
                  :
                  posts.map(post => {
                    return <CardPost key={post.id} post={post}/>
                  })
                }
                </div>
                </div>
              </div>
              <div className="col-3" style={{minHeight:'200px',gap:'7px'}}>
                {
                  rooms.map(room => {
                    return <CardRoom key={room} roomId={room}/>
                  })  
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
  
export default Home;