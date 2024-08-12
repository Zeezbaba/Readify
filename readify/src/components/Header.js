import React from "react";
import './Header.css';

function Header() {
    return (
        <>
            <div className="navbar">
                <h1>READIFY</h1>
                <nav>
                <a href="/">Home</a>
                <a href="/books">Books</a>
                <a href="/profile">Profile</a>
                </nav>
            </div>
        </>
    );
}

export default Header;