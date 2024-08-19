import React from 'react';
import '../styles/Welcome.css';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';


const WelcomePage = () => {
    return (
        <div className="welcome-page">
            <header className="welcome-header">
                <h1>READIFY</h1>
                <nav>
                    <Link to="/signup">
                        <button className="nav-btn">Get Started</button>
                    </Link>
                    <Link to="/login">
                        <button className="nav-btn">Login</button>
                    </Link>
                </nav>
            </header>
            <main className="hero-section">
                <div className="background-overlay">
                    <h1 className="main-title">READIFY</h1>
                    <p className="subtitle">Unleash your inner bibliophile and conquer your book collection!</p>
                    <Link to="/signup">
                        <button className="cta-btn">Join Now</button>
                    </Link>
                </div>
            </main>

            <div>
                <Footer />
            </div>
        </div>
    );
};

export default WelcomePage;