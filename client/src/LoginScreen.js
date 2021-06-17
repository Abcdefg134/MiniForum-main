import React, { useState } from 'react'
import { useHistory } from 'react-router'
import { login } from './axios'
import logo from './img/Logo.png'
export default function LoginScreen({ setToken }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    let history = useHistory()
    const loginBtn = async () => {
        try {
            let body = {
                email,
                password
            }
            const result = await login(body)
            console.log(result);
            setToken(result.data.accessToken)
            history.push('/')
            alert('hello')
        } catch (error) {
            alert(error)
        }
    }
    const handleChangePass = (event) => {
        setPassword(event.target.value)
    }

    const handleChangeEmail = (event) => {
        setEmail(event.target.value)
    }
    const goToSignUp = ()=>{
        history.push('/signup')
    }
    const handleSubmit = (event)=>{
        event.preventDefault()
    }

    return (

        <div className="section">
            <div className="box">
                <div className="img-container">
                    <img src={logo} alt="TIE-Logo" />
                </div>
                <h2>Sign in</h2>
                <form onClick={handleSubmit} >
                    <div>
                        <input className="input-username" type="email" onChange={handleChangeEmail} value={email}/>
                        <label>Email</label>
                    </div>
                    <div>
                        <input className="input-password" type="password" onChange={handleChangePass} value={password} />
                        <label>Password</label>
                    </div>
                    <button  onClick={loginBtn}>Log in</button>
                    <div className="register">
                        <h3>Don't have an account? <a onClick={goToSignUp}>Sign Up</a></h3>
                    </div>
                </form>
            </div>
            <div className="animation-area">
                <ul className="box-area">
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