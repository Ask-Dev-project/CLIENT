import ReactLoading from 'react-loading'

function LoadingSpin(){

  return(
    <div className="row justify-content-center">
      <ReactLoading type="spin" color="##FF2D00"/>
    </div>
  )
}

export default LoadingSpin