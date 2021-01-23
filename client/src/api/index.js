import axios from 'axios'

export const getToken = async user => {
  axios.get('http://localhost:5000/token',{
    params: {
      user
    }
  })
}