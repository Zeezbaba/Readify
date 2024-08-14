import React from "react";
import "../styles/Footer.css";

function Footer() {
    return (
        <>
            <div className="footer">
                <p>&copy; 2024 READIFY</p>
                <nav>
                <a href="/contact">Contact</a>
                <a href="/about">About</a>
                </nav>
            </div>
        </>
    );
}

export default Footer;