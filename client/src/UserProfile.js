import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router';
import { getAvatar, getUserById, updateImgUser, updatePassword } from './axios';
import axios from 'axios'
import './imgBtn.css'
export default function UserProfile() {
    const history = useHistory()
    const [img, setImg] = useState('')
    const getUserReducer = useSelector(state => state.getUserReducer)
    const [currentUser, setCurrentUser] = useState({})
    const [type, setType] = useState('hidden')
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [reNewPassword, setReNewPassword] = useState('')
    useEffect(() => {

        getUserById(getUserReducer.User._id).then(res => {
            setCurrentUser(res.data)
        })
    }, [])
    const editBtn = () => {
        history.push('/editUser')
    }
    const handleChangeImg = (event) => {
        setImg(event.target.files[0])
    }
    const handleChangeCurrentPassword = (event)=>{
        setCurrentPassword(event.target.value)
    }
    const handleChangeNewPassword = (event)=>{
        setNewPassword(event.target.value)
    }
    const handleChangeReNewPassword = (event)=>{
        setReNewPassword(event.target.value)
    }
    const editImgBtn = () => {
        if (!img) {
            alert('I must input Img')
        } else {
            const formData = new FormData();
            formData.append('avatar', img, img.name)
            updateImgUser(formData).then(res => {
                window.location.reload()
            })
        }
    }
    const showEditPassword = () => {
        setType('password')
    }
    const editPassword =()=>{
        
        if (newPassword === reNewPassword && newPassword !=='' ){
            let body ={
                currentPassword,
                newPassword
            }
            updatePassword(body).then(res=>{
                alert('Doi pass thanh cong')
                setCurrentPassword('')
                setNewPassword('')
                setReNewPassword('')
            }).catch((err)=>{
                if(err) 
                alert(err);
                
            })
        } else (
            alert('Moi ban nhap lai')
        )
    }
    return (
        <div>
            <div>Name: {currentUser.name}</div>
            <div>Email: {currentUser.email}</div>
            <div>Address: {currentUser.address}</div>
            <div>Age: {currentUser.age}</div>
            <div>
                <div>Password:*******</div>
                <button onClick={showEditPassword}>Change Pass</button>

            </div>
            <div>
                <li>Avatar</li>
                <img src={'http://localhost:8797/' + currentUser.avatar} height="300px" width="300px"></img>
                <label for='file-upload'>
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuZK3D1EibbMjkeDUE2lJ4WTc_2eNrW25B4g&usqp=CAU" height='30px' width='30px' />
                </label>
                <input id="file-upload" onChange={handleChangeImg} type='file'></input>
                <button onClick={editImgBtn}>Edit Img</button>
            </div>
            <div>  <button onClick={editBtn}>Edit</button></div>
            <div>
                <input type={type} value={currentPassword} onChange={handleChangeCurrentPassword} placeholder="Current Password" ></input>
                <input type={type} value={newPassword} onChange={handleChangeNewPassword} placeholder="New Password"></input>
                <input type={type} value={reNewPassword} onChange={handleChangeReNewPassword} placeholder="Re New Password"></input>
                <button onClick={editPassword} >Submit</button>
            </div>
        </div>
    )
}
