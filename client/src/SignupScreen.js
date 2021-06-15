import React, { useState } from 'react'
import { useHistory } from 'react-router'
import { signup } from './axios'

export default function SignupScreen() {
    const history = useHistory()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [rePassword, setRePassword] = useState('')
    const signupBtn = async ()=>{
        let body = {
            email,
            password,
            address:"default",
            age:'0',
            name:"User",
            role: "user",
            
        }
        if(password === rePassword && password !==""){
           await signup(body).then(res=>{
                history.push('/login')
            }).catch(err=>alert(err))
        } else{
            alert("RePassword does not match")
        }
    }

    const handleChangeEmail = (event)=>{
        setEmail(event.target.value)
    }
    const handleChangePass = (event)=>{
        setPassword(event.target.value)
    }
    const handleChangeRePass = (event)=>{
        setRePassword(event.target.value)
    }
    return (
        <div >
            <input placeholder={'Email'} onChange={handleChangeEmail} value={email} ></input>
            <input placeholder={'Password'} onChange={handleChangePass} value={password} ></input>
            <input placeholder={'RePassword'} onChange={handleChangeRePass} value={rePassword}></input>
            <button onClick={signupBtn} >Dang ky</button>
        </div>
    )
}
