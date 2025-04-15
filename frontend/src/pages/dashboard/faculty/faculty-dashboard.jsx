import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './header';
import Sidebar from './sidebar';
import QuestionBank from './question-bank';
import CreateQuestion from './create-question';
import Results from './results';
import Profile from './profile';

const FacultyDashboard = () => {
  const [activeSection, setActiveSection] = useState('Question Bank');

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header activeSection={activeSection} />
        <main className="flex-1 overflow-auto p-6">
          <Routes>
            <Route path="/" element={<QuestionBank />} />
            <Route path="/question-bank" element={<QuestionBank />} />
            <Route path="/create-question" element={<CreateQuestion />} />
            <Route path="/results" element={<Results />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default FacultyDashboard;
