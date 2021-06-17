import React, { useState } from 'react'
import { useHistory } from 'react-router'
import { signup } from './axios'
import logo from './img/Logo.png'
export default function SignupScreen() {
    const history = useHistory()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [rePassword, setRePassword] = useState('')
    const signupBtn = async () => {
        let body = {
            email,
            password,
            address: "default",
            age: '0',
            name: "User",
            role: "user",
            avatar: 'uploads/Untitled.png',
        }
        if (password === rePassword && password !== "") {
            await signup(body).then(res => {
                history.push('/login')
                alert("SignUp success")
            }).catch(err => alert(err))
        } else {
            alert("RePassword does not match")
        }
    }

    const handleChangeEmail = (event) => {
        setEmail(event.target.value)
    }
    const handleChangePass = (event) => {
        setPassword(event.target.value)
    }
    const handleChangeRePass = (event) => {
        setRePassword(event.target.value)
    }
    const goToLogin = () => {
        history.push('/')
    }
    const handleSubmit = (event)=>{
        event.preventDefault()
    }
    return (
        <div className="section">
            <div class="box">
                <div class="img-container">
                    <a><img src={logo} alt="TIE-Logo" /></a>
                </div>
                <h2>Sign in</h2>
                <form onClick={handleSubmit} id="myForm">
                    <div>
                        <input className="input-username" type="email" onChange={handleChangeEmail} value={email}  />
                        <label>Email</label>
                    </div>
                    <div>
                        <input className="input-password" type="password" onChange={handleChangePass} value={password}  />
                        <label>Password</label>
                    </div>
                    <div>
                        <input className="input-password" type="password" onChange={handleChangeRePass} value={rePassword}  />
                        <label>Confirm Password</label>
                    </div>
                    <button onClick={signupBtn} id="submit">Log in</button>
                    <div className="register">
                        <h3>Already have an account? <a onClick={goToLogin}>Login</a></h3>
                    </div>
                </form>
            </div>
            <div className="animation-area">
                <ul class="box-area">
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>
            </div>
        </div>
    )
}







