import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import '../index.css';

const MainLayout = () => {
    return (
        <div className="layout-container">
            <header className="header">
                <div className="logo">My App</div>
                <nav className="nav">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/about" className="nav-link">About</Link>
                </nav>
            </header>
            <main className="content">
                <Outlet />
            </main>
            <footer className="footer">
                © {new Date().getFullYear()} My React App. All rights reserved.
            </footer>
        </div>
    );
};

export default MainLayout;
