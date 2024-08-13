import React from "react";
import './Header.css';

function Header() {
    return (
        <>
            <div className="navbar">
                <h1>READIFY</h1>
                <nav>
              <button><a href="/">Home</a></button>
                <button><a href="/books">Books</a></button>
                <button><a href="/profile">Profile</a></button>
                </nav>
            </div>
        </>
    );
}

export default Header;