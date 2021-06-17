import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import {Link} from 'react-router-dom'
import { getAllUser, deleteUser } from './axios'
export default function AdminPage() {

    const history = useHistory()
    const [allUser, setAllUser] = useState([])
    const getUserReducer = useSelector(state => state.getUserReducer)
    useEffect(() => {
        getAllUser().then(res => {
            setAllUser(res.data)
        }).catch((err) => {
            alert(err)
        })
    })

    const deleteUser = (item, index) => {
        let id = item._id
        console.log(id);
        deleteUser(item._id).then(res => {
            console.log("Da xoa");
        })
        let newList = allUser
        newList.splice(index, 1)
        setAllUser([...newList])
    }
    const logoutBtn = () => {
        localStorage.clear();
        window.location.reload()
    }
    const goToMainPage = () => {
        history.push('/')
    }
    const goToMyProfile = ()=>{
        history.push('/userprofile')
    }
    const renderUser = (item, index) => {
        return (
            <div>
                <Link to={'/userprofile/' + item._id}>
                    <label>{index + 1}</label>
                    <h3>{item.name} </h3>
                    <img src={item.avatar ? 'http://localhost:8797/' + item.avatar : null} height="30px" width="30px"></img>
                    <h3>Post: {item.userPost ? item.userPost.length : 0}</h3>
                    <button onClick={() => { deleteUser(item, index) }}>Delete</button>
                </Link>
            </div>
        )
    }
    return (
        <div>
            <div>
                <button onClick={goToMyProfile}>My Profile</button>
                <button onClick={goToMainPage}>Main Page</button>
                <button onClick={logoutBtn}>Log Out</button>
            </div>
            {allUser.map(renderUser)}
        </div>
    )
}
