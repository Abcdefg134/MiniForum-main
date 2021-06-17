import axios from "axios";


let instantAxios = axios.create({
    timeout: 20000,
    baseURL: 'http://localhost:8797'
})

instantAxios.interceptors.request.use((request)=>{
    let token = localStorage.getItem('accessToken')
    request.headers['Authorization'] = 'Bearer '+ token
    return request
})

export const login = (body)=>{
    return instantAxios.post('/login', body)
}

export const signup = (body)=>{
    return instantAxios.post('/signup',body)
}

export const getUserById = (id)=>{
    return instantAxios.get('/user/'+id)
}

export const updateUser = (body)=>{
    return instantAxios.put('/user/update',body)
}

export const updateImgUser = (formData)=>{
    return instantAxios.post('/user/avatar', formData)
}

export const updatePassword = (body)=>{
    return instantAxios.post('/user/password', body)
}

export const getAllPost = ()=>{
    return instantAxios.get('/post')
}

export const deletePost = (id)=>{
    return instantAxios.delete('/post/'+id)
}

export const deleteUser = (id)=>{
    return instantAxios.delete('/user/'+id)
}

export const newPOst = (body)=>{
    return instantAxios.post('/post/add-post',body)
}