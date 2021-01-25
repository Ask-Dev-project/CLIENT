import { Link, useLocation } from 'react-router-dom'
import Nav from '../components/Navbar2'
import CardPost from '../components/CardPost'
import CardRoom from '../components/CardRoom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import LoadingSpin from '../components/LoadingSpin'

const rooms = [
  "1","2","3","4"
]
// const posts = [1,2,3,4,5,6,7,8,9,10,11,12]

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
      axios.get('http://localhost:3002/post/category',{
        data:{
          category: query.get("category")
        }
      })
        .then(({data}) => {
          console.log(data);
        })
    }
    // eslint-disable-next-line
  },[query.get("category")])
  useEffect(()=>{
    axios.get('http://localhost:3002/post')
      .then(({data}) => {
        console.log(data);
        setPosts([])
        setPosts(posts.concat(data))
        setLoadingPost(false)
        setInit(false)
      }).catch(err => console.log(err))
      // eslint-disable-next-line
  },[])

  return(
    <>
      <Nav/>
      <div className="container" style={{minWidth:'95vw',minHeight:'80vh'}}>
        <div className="row">
          <div className="col-2 bg-info" style={{minHeight:'200px'}}>
            <div className="d-flex flex-column align-items-center" style={{marginTop:'20px',width:'100%',gap:'7px'}}>
              <Link to="?category=javascript" className="btn">Javascript</Link>
              <Link to="?category=python" className="btn">Python</Link>
              <Link to="?category=java" className="btn">Java</Link>
              <Link to="?category=cpp" className="btn">C++</Link>
              <Link to="?category=cs" className="btn">C#</Link>
            </div>
          </div>
          <div className="col-7" style={{minHeight:'200px'}}>
            {
              loadingPost ?
              <LoadingSpin/>
              :
              posts.map(post => {
                return <CardPost key={post.id} post={post}/>
              })
            }
          </div>
          <div className="col-3 bg-warning" style={{minHeight:'200px',gap:'7px'}}>
            {
              rooms.map(room => {
                return <CardRoom key={room} roomId={room}/>
              })  
            }
          </div>
        </div>
      </div>
    </>
  )
}
  
export default Home;