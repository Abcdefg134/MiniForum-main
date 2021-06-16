import React, { useState } from 'react'
import { useSelector } from 'react-redux'
export default function AdminPage() {
    const [allUser, setAllUser] = useState([])
    const getUserReducer = useSelector(state => state.getUserReducer)
    return (
        <div>
            halo
        </div>
    )
}
