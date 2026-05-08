import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import './index.css';

function App() {
    return (
        <div className="app">
            <Navbar />
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
}

export default App;