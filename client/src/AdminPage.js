import React, { useEffect, useState } from 'react'
//import { useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'
import { getAllUser, deleteUser, getAllPost, deletePost } from './axios'
import io from 'socket.io-client'

const socket = io('http://localhost:8797', { transport: ['websocket'] })
export default function AdminPage() {
    const [postData, setPostData] = useState([])
    const history = useHistory()
    const [allUser, setAllUser] = useState([])
    const [termUser, setTermUser] = useState()
    const [termPost, setTermPost] = useState()
    const [newPost, setNewPost] = useState()
    const [postDele,setPostDele] = useState('alo')
    const [liked,setLiked] = useState()
    const [unLiked, setUnliked] = useState()
    const [newComment,setNewComment] = useState()
    const [delId, setDelId] = useState()
    //const getUserReducer = useSelector(state => state.getUserReducer)
    useEffect(() => {
        getAllUser().then(res => {
            setAllUser(res.data)
        }).catch((err) => {
            alert(err)
        })
    }, [])

    
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
        socket.on('like',(id)=>{
            console.log(id);
            setLiked(id)
        })
        socket.on('unLikePost',(id)=>{
            setUnliked(id)
        })
        socket.on('delete',(id)=>{
            console.log(id);
            setPostDele(id)
        })
        socket.on('addComment',data=>{
            console.log(data);
            setNewComment(data)
        })
        socket.on('delComment',(id)=>{
            setDelId(id)
        })
    }, [])
    useEffect(() => {
        getAllPost().then(res => {
            setPostData(res.data)
            console.log(res.data);
        })
    }, [newPost, postDele,liked,unLiked,newComment,delId])
    useEffect(()=>{
        setUnliked('')
        setLiked('')
        setNewComment('')
        setDelId('')
    },[postData])

    const deleteUserBtn = (item, index) => {
        let id = item._id
        console.log(id);
        deleteUser(id).then(res => {
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
    const goToMyProfile = () => {
        history.push('/userprofile')
    }
    const handleChangeTermUser = (event) => {
        setTermUser(event.target.value)
    }
    
    const handleChangeTermPost = (event)=>{
        setTermPost(event.target.value)
    }

    const searchName = (item) => {
        if (termUser == null) {
            return item
        } else if (item.name.toLowerCase().includes(termUser.toLowerCase())) {
            return (item)
        }
    }
    const renderUser = (item, index) => {
        return (
            <p>
                <Link to={'/userprofile/' + item._id}>
                    <label>{index + 1}</label>
                    <h3>{item.name} </h3>
                    <img src={item.avatar ? 'http://localhost:8797/' + item.avatar : null} height="30px" width="30px"></img>
                    <h3>Post: {item.userPost ? item.userPost.length : 0}</h3>
                </Link>
                {item.role == 'user' ? (<button onClick={() => { deleteUserBtn(item, index) }}>Delete</button>) : null}

            </p>
        )
    }

    const renderPost = (item, index) => {
        return (
            <p >
                <Link to={'/post/' + item._id}>{index + 1}
                    <img src={item.author ? item.author.avatar ? 'http://localhost:8797/' + item.author.avatar : null : null} height="30px" width="30px"></img>
                    {item.author ? item.author.name : 'User đã bị xóa'}:{item.title}:{item.comment?.length} : {item.like?.length}

                </Link>

                <button onClick={() => { deletePostBtn(item, index) }}>Delete Post</button>

            </p>
        )
    }

    const searchPost = (item) => {
        if (termPost == null) {
            return item
        } else if (item.title.toLowerCase().includes(termPost.toLowerCase()) || item.author?.name.toLowerCase().includes(termPost.toLowerCase())) {
            return item
        }
    }
    const deletePostBtn = async (item, index) => {
        let id = item._id
        console.log(id);
        await deletePost(item._id).then(res => {
            console.log("Da xoa");
            // socket.emit('deletePost',id)

        })
        socket.emit('deletePost', id)

    }
    return (
        <div>
            <div>
                <button onClick={goToMyProfile}>My Profile</button>
                <button onClick={goToMainPage}>Main Page</button>
                <button onClick={logoutBtn}>Log Out</button></div>
            <input type='text' onChange={handleChangeTermUser} />
            <div>{allUser.filter(searchName).map(renderUser)}</div>
            <div>
                <div>
                    <input type='text' onChange={handleChangeTermPost} />
                </div>
                {postData.filter(searchPost).map(renderPost)}
            </div>


        </div>
    )
}
