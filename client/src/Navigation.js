import React, { useEffect, useState,Suspense, lazy } from 'react'

import {
    BrowserRouter as Router,
    Route, useHistory, useParams
} from "react-router-dom";
import jwtDecode from 'jwt-decode';
import Main from './Main'
import LoginScreen from './LoginScreen'
import SignupScreen from './SignupScreen';
//import UserProfile from './UserProfile';
import { useDispatch } from 'react-redux';

import { GET_USER } from './actions/types';

const UserProfile = lazy(()=> import('./UserProfile'))
const EditUserProfile = lazy(()=> import('./EditUserProfile'))
const Post = lazy(()=>import('./Post'))
const keyStorage = 'accessToken'

export default function Navigation() {
    const dispatch = useDispatch()
    const [token, setToken] = useState('')

    const loginSucess = (token) => {
        setToken(token)
        localStorage.setItem(keyStorage, token)
        console.log(token);
        

    }
    useEffect(() => {
        let token = localStorage.getItem(keyStorage)
        setToken(token)
    }, [])
        if(token){
        var crurrentUser = jwtDecode(token);
        dispatch({type: GET_USER, payload: crurrentUser})}

    return (
        <div>
            <Router>
                
                    <Route exact path="/signup" component={SignupScreen} />
                    {!token ?
                        <LoginScreen setToken={loginSucess} /> :
                        (<><Suspense fallback={<div>Loading...</div>}>
                            <Route exact path="/" component={Main} />
                            <Route exact path="/userprofile" component={UserProfile} />
                            <Route exact path="/post/:id" component={Post} />
                            <Route exact path='/editUSer' component={EditUserProfile} />
                            </Suspense></>)}
                           
            </Router>
        </div>
    )
}
