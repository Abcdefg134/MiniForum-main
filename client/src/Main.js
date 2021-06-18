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
    const [currentPost, setCurrentPost] = useState([])
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
    //console.log(postDele);
    //console.log(getUserReducer.User);
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
    useEffect(()=>{
        socket.on('delete',(id)=>{
            console.log(id);
            setPostDele(id)
        })
    },[])
    useEffect(() => {
        getSpace().then(res => {
            setSpace(res.data)
        }).catch(err => alert(err))
    }, [])
    //console.log(space);
    //useEffect(() => {
      //  if (newPost) {
        //    currentPost.push(newPost)
          //  console.log(currentPost);
       // }
    //}, [newPost, currentPost])
    useEffect(() => {
        getAllPost().then(res => {
            setPostData(res.data)
            console.log(res.data);
        })
    }, [newPost, postDele])
    const deletePostBtn = async (item, index) => {
        let id = item._id
        console.log(id);
        await deletePost(item._id).then(res => {
            console.log("Da xoa");
            socket.emit('deletePost',id)
            
        })
        socket.emit('deletePost',id)
        let newList = postData
        newList.splice(index, 1)
        setPostData([...newList])
    }
    const logoutBtn = () => {
        localStorage.clear();
        window.location.reload()

    }
    //console.log(socket);
    const submitBtn = () => {
        let data =  new FormData()
        data.append('title',title)
        if(file){
        data.append('imgVideo',file,file.name)}
        data.append('described',described)
        data.append('like','')
        data.append('comment','')
        data.append('space',spaceId)
        data.append('author',getUserReducer.User._id)
        newPOst(data).then((res) => {
            console.log('hola');
        })
        socket.emit('newPost', {
            data
        })
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
        setFile(event.target.files[0])
    }
    //console.log(postData)
    const renderPost = (item, index) => {
        return (
            <p >
                <Link to={'/post/' + item._id}>{index + 1}
                    <img src={item.author ? item.author.avatar ? 'http://localhost:8797/' + item.author.avatar : null : null} height="30px" width="30px"></img>
                    {item.author ? item.author.name : 'User đã bị xóa'}:{item.title}:{item.comment?.length} : {item.like?.length}

                </Link>
                {getUserReducer.User.role === 'admin' ?
                    (<><button onClick={() => { deletePostBtn(item, index) }}>Delete Post</button></>) : null}

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

                {postData.map(renderPost)}



            </div>
            )
}
