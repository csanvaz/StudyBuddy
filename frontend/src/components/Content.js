import React from 'react';
import Tab1 from './Tabs/Tab1';
import Tab2 from './Tabs/Tab2';
import StudyTab from './Tabs/StudyTab';
import QuizTab from './Tabs/QuizTab';

function Content({ selectedTab }) {
    return (
        <div className="content">
            {selectedTab === 'Tab1' && <Tab1 />}
            {selectedTab === 'StudyTab' && <StudyTab />}
            {selectedTab === 'QuizTab' && <QuizTab />}
        </div>
    );
}

export default Content;