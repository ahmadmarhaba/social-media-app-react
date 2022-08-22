import { useCallback, useEffect, useState } from "react"
import Login from "./components/login"
import Register from "./components/register"
import './App.css';
import Loader from "./components/loader"
import Welcome from "./welcome"
import PropTypes from 'prop-types'
import { fetchUser } from "./store/actions/userAction"
import { useDispatch, useSelector } from "react-redux"
import 'bootstrap-icons/font/bootstrap-icons.css';
import { AnyAction, Dispatch } from "redux";

App.contextTypes = {
  test: PropTypes.string
}
function App() {
  const [currentTab, setCurrentTab] = useState(false)
  const dispatch : Dispatch<any> = useDispatch() as any;
  let { user } = useSelector((state: any) => state.user)
  
  const verifyUser = useCallback(() => {
    fetch(process.env.REACT_APP_API_ENDPOINT + "users/refreshToken", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    }).then(async response => {
      if (response.ok) {
        const data = await response.json()
        const dataD = { ...user , token: data.token }
        dispatch(fetchUser(dataD))
      } 
      else{    
          const dataD = { ...user , token: null }
          dispatch(fetchUser(dataD))
      }
      // call refreshToken every 5 minutes to renew the authentication token.
      setTimeout(verifyUser, 5 * 60 * 1000)
    })
    // eslint-disable-next-line
  }, [dispatch])

  useEffect(() => {
    verifyUser()
  }, [verifyUser])

  /**
   * Sync logout across tabs
   */
   const syncLogout = useCallback((event : any) => {
    if (event.key === "logout") {
      // If using react-router-dom, you may call history.push("/")
      window.location.reload()
    }
  }, [])

  useEffect(() => {
    window.addEventListener("storage", syncLogout)
    return () => {
      window.removeEventListener("storage", syncLogout)
    }
  }, [syncLogout])

  return user.token === null ? (
    <div className="auth">
      <div className="auth-div">
        <input type="button" value="Login" onClick={() => { setCurrentTab(false) }} className={!currentTab ? "selectedButton" : ""}/>
        <input type="button" value="Register" onClick={() => { setCurrentTab(true) }} className={currentTab ? "selectedButton" : ""} />
      </div>
        {
          currentTab ? <Register />  : <Login />
        }
    </div>
  ): user.token ? (
    <Welcome />
  ) : (
    <Loader />
  )
}

export default App