import React from 'react';
import Tab1 from './Tabs/Tab1';
import Tab2 from './Tabs/Tab2';
import QuizTab from './Tabs/QuizTab';

function Content({ selectedTab }) {
    return (
        <div className="content">
            {selectedTab === 'Tab1' && <Tab1 />}
            {selectedTab === 'Tab2' && <Tab2 />}
            {selectedTab === 'QuizTab' && <QuizTab />}
        </div>
    );
}

export default Content;