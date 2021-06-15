import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory} from 'react-router'
import { Link,  useLocation  } from 'react-router-dom'
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
    },[])
    const deletePostBtn = (item)=>{
        deletePost(item._id).then(res=>{
            console.log('data');
        })
    }
    console.log(postData)
    const renderPost = (item, index) => {
        return (
            <p >
                <Link to={'/post/' + item._id}>
                    {item.title}
                </Link>
            {getUserReducer.User.role==='admin'?<button>Delete Post</button>:null}
            </p>
        )
    }
    return (
        <div>
            <button onClick={profileBtn}>Hồ sơ</button>
            {postData.map(renderPost)}
        </div>
    )
}
