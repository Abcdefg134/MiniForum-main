import React, { useState } from 'react'
import { useHistory } from 'react-router'
import { login } from './axios'

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

    return (
        <div>
            <input type='email' placeholder={'Email'} value={email} onChange={handleChangeEmail} />
            <input type='password' placeholder={'Password'} value={password} onChange={handleChangePass} />
            <button onClick={loginBtn}>Login</button>
        </div>
    )
}
