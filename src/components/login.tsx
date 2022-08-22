import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { fetchUser } from "../store/actions/userAction"

const Login = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const dispatch : any = useDispatch();
  let { user } = useSelector((state: any) => state.user)

  const formSubmitHandler = (e : any) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    const genericErrorMessage = "Something went wrong! Please try again later."

    fetch(process.env.REACT_APP_API_ENDPOINT + "users/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username : email , password }),
    })
      .then(async response => {
        setIsSubmitting(false)
        if (!response.ok) {
          if (response.status === 400) {
            setError("Please fill all the fields correctly!")
          } else if (response.status === 401) {
            setError("Invalid email and password combination.")
          } else {
            setError(genericErrorMessage)
          }
        } else {
          const data = await response.json()
          const dataD = { ...user , token: data.token }
          dispatch(fetchUser(dataD))
        }
      })
      .catch(error => {
        setIsSubmitting(false)
        setError(genericErrorMessage)
      })
  }
  return (
    <>
    {error && <div className="auth-error">{error}</div>}
      <form  onSubmit={formSubmitHandler}  className="auth-form">
          <input
            placeholder="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        <input type="submit"
          disabled={isSubmitting}
          value={`${isSubmitting ? "Signing In" : "Sign In"}`}
         />
      </form>
    </>
  )
}

export default Login