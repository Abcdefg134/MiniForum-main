import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import { Link, useLocation } from 'react-router-dom'
import { deletePost, getAllPost } from './axios'


export default function Main() {
    let location = useLocation()
    const history = useHistory()
    const profileBtn = () => {
        history.push('/userprofile')
    }
    const [postData, setPostData] = useState([])
    const [url, setUrl] = useState('http://localhost:8797/post')
    const getUserReducer = useSelector(state => state.getUserReducer)
    console.log(getUserReducer.User);
    useEffect(() => {
        getAllPost().then(res => {
            setPostData(res.data)

        })
    }, [])
    const deletePostBtn = (item,index) => {
        deletePost(item._id).then(res => {
            console.log("Da xoa");
            const array = postData.splice(index,1)
            
            setPostData(array)
        })
    }
    const logoutBtn = ()=>{
        localStorage.clear();
        window.location.reload()

    }

    console.log(postData)
    const renderPost = (item, index) => {
        return (
            <p >
                <Link to={'/post/' + item._id}>
                <img src={item.author?item.author.avatar?'http://localhost:8797/' + item.author.avatar:null:null}></img>
                     {item.author?item.author.name:'User đã bị xóa'}:{item.title}:{item.comment?.length} : {item.like?.length}
                     
                </Link>
                {getUserReducer.User.role === 'admin' ?
                    (<><button onClick={() => { deletePost(item._id) }}>Delete Post</button></>) : null}

            </p>
        )
    }
    return (
        <div>
            <button onClick={profileBtn}>Hồ sơ</button>
            {postData.map(renderPost)}
            <button onClick={logoutBtn}>Dang xuat</button>
        </div>
    )
}
