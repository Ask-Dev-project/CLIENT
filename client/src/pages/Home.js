import { Link, useLocation } from 'react-router-dom'
import { NavBar } from '../components'
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
      setLoadingPost(true)
      setPosts([])
      axios.get(`http://localhost:3005/post/category?name=${query.get("category")}`,{
        data:{
          category: query.get("category")
        }
      })
        .then(({data}) => {
          console.log(data)
          setPosts(data)
          setLoadingPost(false)
        }).catch(err => console.log(err))
    }else if(!query.get("category") && !init) {
      setPosts([])
      axios.get('http://localhost:3005/post')
      .then(({data}) => {
        console.log(data);
        setPosts(data)
        setLoadingPost(false)
        setInit(false)
      }).catch(err => console.log(err))
    }
    // eslint-disable-next-line
  },[query.get("category")])
  useEffect(()=>{
    axios.get('http://localhost:3005/post')
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
      <NavBar/>
      <div className="container" style={{minWidth:'95vw',minHeight:'80vh'}}>
        <div className="row">
          <div className="col-2 " style={{minHeight:'200px'}}>
            <div className="d-flex flex-column align-items-center" style={{marginTop:'20px',width:'100%',gap:'7px'}}>
              <Link to="/" className="btn">Programming Language</Link>
              <Link to="?category=Javascript" className="btn">Javascript</Link>
              <Link to="?category=Python" className="btn">Python</Link>
              <Link to="?category=Java" className="btn">Java</Link>
              <Link to="?category=Cpp" className="btn">C++</Link>
              <Link to="?category=Cs" className="btn">C#</Link>
            </div>
          </div>
          <div className="col-10">
            <div className="row">
              <h2>FORM posting</h2>
            </div>
            <div className="row">
              <div className="col-9" style={{minHeight:'200px'}}>
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
        </div>
      </div>
    </>
  )
}
  
export default Home;