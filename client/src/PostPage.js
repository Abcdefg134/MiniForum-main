import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router';
import { getPostById, getUserById, likePost, unLikePost } from './axios';
import io from 'socket.io-client'

const socket = io('http://localhost:8797', { transport: ['websocket'] })

export default function PostPage() {
    const param = useParams()
    const getUserReducer = useSelector(state => state.getUserReducer)
    //console.log(getUserReducer.User._id);
    const [user, setUser] = useState({})
    const [post, setPost] = useState({})
    const [idLiked,setIdLiked] = useState()
    const [idUnLiked, setIdUnLiked] = useState()
    useEffect(() => {
        getUserById(getUserReducer.User._id).then(res => {
            setUser(res.data)
        })
    }, [])
    useEffect(()=>{
        setIdUnLiked('')
        setIdLiked('')
    },[post])
    useEffect(()=>{
        socket.on('like',(id)=>{
            console.log(id);
            setIdLiked(id)
        })
        socket.on('unLikePost',(id)=>{
            console.log(id);
            setIdUnLiked(id)
        })
    },[])
    useEffect(() => {
        getPostById(param.id).then(res => {
            setPost(res.data.data)
            console.log(res.data.data);
        })
    }, [idLiked,idUnLiked])
    //console.log(post._id);
    //console.log(user.userPost);

    const renderPost = (item) => {
        if (!item.imgVideo) {
            return null
        } else if (item.imgVideo?.split('.').pop() == 'png' || item.imgVideo?.split('.').pop() == 'jpg' || item.imgVideo?.split('.').pop() == 'jpeg') {
            return (
                <img src={'http://localhost:8797/' + item.imgVideo} height="100px" width="100px" />
            )
        } else {
            return (
                <p>The forum doesn't support file preview yet.Please click <a href={'http://localhost:8797/' + post?.imgVideo}>here.</a>File name:  {post?.imgVideo?.split('uploads').pop()}</p>
            )
        }

    }
    const checkLike = post?.like?.filter(item => item._id.includes(user._id)).length
    console.log(checkLike);
    const likeBtn = () => {
            let body = {
                _id: user._id
            }
            likePost(param.id, body).then(()=>{
                socket.emit('likePost',body._id)
            }).catch((err) => { if (err) alert(err) })
    }
    const unlikeBtn = ()=>{
        let body ={
            _id: user._id
        }
        unLikePost(param.id, body).then(()=>{
            socket.emit('unLike',body._id)
        }).catch((err)=>{if(err) alert(err)})
    }


    return (
        <div>
            <p> <img src={'http://localhost:8797/' + post?.author?.avatar} height="100px" width="100px" />  {post.author?.name}</p>
            <p>  {post.title}</p>
            <p> {post.described}</p>
            {renderPost(post)}
            <p>{post?.like?.length} <button onClick={checkLike?unlikeBtn:likeBtn}>{checkLike?'UnLike':'Like'}</button></p>
        </div>
    )
}
