import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import { Link, useLocation } from 'react-router-dom'
import { deletePost, getAllPost, getSpace, newPOst } from './axios'
import io from 'socket.io-client'

const socket = io('http://localhost:8797', { transport: ['websocket'] })

export default function Main() {
    let location = useLocation()
    const history = useHistory()
    const profileBtn = () => {
        history.push('/userprofile')
    }
    //const [currentPost, setCurrentPost] = useState([])
    const [postData, setPostData] = useState([])
    const getUserReducer = useSelector(state => state.getUserReducer)
    const [newPost, setNewPost] = useState()
    const [title, setTitle] = useState()
    const [described, setDescribed] = useState()
    const [author, setAuthor] = useState()
    const [space, setSpace] = useState([])
    const [spaceId, setSpaceId] = useState()
    const [file, setFile] = useState()
    const [postDele,setPostDele] = useState('alo')
    const [term, setTerm] = useState()
    const [liked,setLiked] = useState()
    const [unLiked, setUnliked] = useState()
    const [newComment,setNewComment] = useState()
    const [delId, setDelId] = useState()
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
    useEffect(()=>{
        setUnliked('')
        setLiked('')
        setNewComment('')
        setDelId('')
    },[postData])
    useEffect(() => {
        getSpace().then(res => {
            setSpace(res.data)
        }).catch(err => alert(err))
    }, [])
    useEffect(() => {
        getAllPost().then(res => {
            setPostData(res.data)
            console.log(res.data);
        })
    }, [newPost, postDele,liked,unLiked,newComment,delId])
    
    const logoutBtn = () => {
        localStorage.clear();
        window.location.reload()

    }
    //console.log(socket);
    const submitBtn = async () => {
        let data =  new FormData()
        data.append('title',title)
        if(file){
        data.append('imgVideo',file,file.name)}
        data.append('described',described)
        data.append('like','')
        data.append('comment','')
        data.append('space',spaceId)
        data.append('author',getUserReducer.User._id)
        if(!title){
            alert('phai dien title')
        }else if(!spaceId){
            alert('phai chon space')
        }
        
        else {
        await newPOst(data).then((res) => {
            console.log('hola');
        })
         socket.emit('newPost', {
            data
        })}
    }
    const handleChangeTitle = (event) => {

        setTitle(event.target.value)
    }
    const handleChangeDescribed = (event) => {
        setDescribed(event.target.value)
    }
    const handleChangeSpaceId = (event) => {
        setSpaceId(event.target.value)
    }
    const goToAminPage = () => {
        history.push('/admin')
    }
    const handleChangeFile = (event)=>{
        
        //const  getSize = 
        if(event.target.files[0].size>40000000){
            alert('Max size is 40mb')
            setFile('')
        } else{
            setFile(event.target.files[0])
        }
    }
    const handleChangeTerm = (event)=>{
        setTerm(event.target.value)
    }

    const searchPost = (item)=>{
        if(term == null){
            return item
        } else if(item.title.toLowerCase().includes(term.toLowerCase())|| item.author?.name.toLowerCase().includes(term.toLowerCase())){
            return item
        }
    }
    //console.log(postData)
    const renderPost = (item, index) => {
        return (
            <p >
                <Link to={'/post/' + item._id}>{index + 1}
                    <img src={item.author ? item.author.avatar ? 'http://localhost:8797/' + item.author.avatar : null : null} height="30px" width="30px"></img>
                    {item.author ? item.author.name : 'User đã bị xóa'}:{item.title}:{item.comment?.length} : {item.like?.length}

                </Link>
            </p>
        )
    }
    //console.log(spaceId);
    return (
        <div>

            {getUserReducer.User.role === 'admin' ? (
                <><button onClick={goToAminPage}>forum manager</button>
                </>) : null}
            <button onClick={logoutBtn}>Dang xuat</button>
            <button onClick={profileBtn}>Hồ sơ</button>
            <div>
                <div>
                    <label>
                        Title
                    </label>
                    <input value={title} onChange={handleChangeTitle} />
                </div>
                <div>
                    <label>
                        Described
                    </label>
                    <input value={described} onChange={handleChangeDescribed} />
                </div>
                <div>
                    <label>
                        Space
                    </label>
                    <select value={spaceId} onChange={handleChangeSpaceId} >
                        <option disabled selected  >Select space</option>
                        {space?.map((item, index) => {
                            return <option key={index} value={item._id}>{item.name}</option>
                        })}
                    </select>
                    <div>
                        <input type='file' onChange={handleChangeFile} />
                    </div>
                    </div>
                    <button onClick={submitBtn}>Submit</button>
                </div>
                <div>
                    <input type='text' onChange={handleChangeTerm} />
                </div>
                {postData.filter(searchPost).map(renderPost)}



            </div>
            )
}
