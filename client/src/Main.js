import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import { Link, useLocation } from 'react-router-dom'
import { deletePost, getAllPost, newPOst } from './axios'
import io from 'socket.io-client'

const socket = io('http://localhost:8797', { transport: ['websocket'] })

export default function Main() {
    let location = useLocation()
    const history = useHistory()
    const profileBtn = () => {
        history.push('/userprofile')
    }
    const [currentPost, setCurrentPost] = useState([])
    const [postData, setPostData] = useState([])
    const getUserReducer = useSelector(state => state.getUserReducer)
    const [newPost, setNewPost] = useState()
    console.log(getUserReducer.User);
    useEffect(() => {
        socket.on("getPost", data => {
            console.log(data);
            setNewPost({
                title: data.title,
                imgVideo: data.imgVideo,
                described: data.described,
                like: data.like,
                comment: data.comment,
                author: data.author,
                space: data.space
            })
        })
    }, [])

    useEffect(() => {
        if (newPost) {
            currentPost.push(newPost)
            console.log(currentPost);
        }
    }, [newPost, currentPost])
    useEffect(() => {
        getAllPost().then(res => {
            setPostData(res.data)
            console.log('abc');
        })
    }, [newPost])
    const deletePostBtn = (item, index) => {
        let id = item._id
        console.log(id);
        deletePost(item._id).then(res => {
            console.log("Da xoa");
        })
        let newList = postData
        newList.splice(index, 1)
        setPostData([...newList])
    }
    const logoutBtn = () => {
        localStorage.clear();
        window.location.reload()

    }
    console.log(socket);
    const abcBtn = () => {
        let data = {
            title: 'abc',
            described: 'def',
            like: [],
            comment: [],
            space: 'un',
            author: getUserReducer.User._id
        }
        newPOst(data).then((res) => {
            console.log('hola');
        })
        socket.emit('newPost', {
            title: 'abc',
            described: 'def',
            like: [],
            comment: [],
            space: 'un',
            author: getUserReducer.User._id
        })
    }

    const goToAminPage = () => {
        history.push('/admin')
    }
    console.log(postData)
    const renderPost = (item, index) => {
        return (
            <p >
                <Link to={'/post/' + item._id}>{index + 1}
                    <img src={item.author ? item.author.avatar ? 'http://localhost:8797/' + item.author.avatar : null : null}></img>
                    {item.author ? item.author.name : 'User đã bị xóa'}:{item.title}:{item.comment?.length} : {item.like?.length}

                </Link>
                {getUserReducer.User.role === 'admin' ?
                    (<><button onClick={() => { deletePostBtn(item, index) }}>Delete Post</button></>) : null}

            </p>
        )
    }
    return (
        <div>
            {getUserReducer.User.role === 'admin' ? (
                <><button onClick={goToAminPage}>forum manager</button>
                </>) : null}
            <button onClick={logoutBtn}>Dang xuat</button>
            <button onClick={profileBtn}>Hồ sơ</button>
            {postData.map(renderPost)}

            <button onClick={abcBtn}>Test</button>

        </div>
    )
}
