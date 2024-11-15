import { Link } from "react-router-dom"
import React from "react"


const Landing = () => {
    return (
    <div>
        <h1>Landing Page</h1>
        <Link to="/login">Login</Link>
        <Link to="/signup">Sign up</Link>
    </div>
)}

export default Landing