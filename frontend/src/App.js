import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Content from './components/Content';
import './styles/App.css';

function App() {
    const [selectedTab, setSelectedTab] = useState('Tab1');

    return (
        <div className="app">
            <Sidebar setSelectedTab={setSelectedTab} selectedTab={selectedTab} />
            <Content selectedTab={selectedTab} />
        </div>
    );
}

export default App;