import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <h1>
                <NavLink to="/">READIFY</NavLink>
                </h1>
            </div>
            <ul className="navbar-links">
                <li>
                    <NavLink to="/home" end activeClassName="active">Home</NavLink>
                </li>
                <li>
                    <NavLink to="/book-list" activeClassName="active">Book List</NavLink>
                </li>
                <li>
                    <NavLink to="/add-books" activeClassName="active">Add Books</NavLink>
                </li>
                <li>
                    <NavLink to="/profile" activeClassName="active">Profile</NavLink>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;