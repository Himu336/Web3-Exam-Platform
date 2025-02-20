import { useState } from 'react';
import Header from './header';
import Sidebar from './sidebar';
import ExamList from './exam-list';
import ResultList from './result-list';
import ExamSchedule from './exam-schedule';
import Profile from './profile';

const StudentDashboard = () => {
  const [activeSection, setActiveSection] = useState('Take Exam');

  const renderContent = () => {
    switch (activeSection) {
      case 'Take Exam':
        return <ExamList />;
      case 'Result':
        return <ResultList />;
      case 'Exam Schedule':
        return <ExamSchedule />;
      case 'Student Profile':
        return <Profile />;
      default:
        return <ExamList />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header activeSection={activeSection} />
        <main className="flex-1 overflow-auto p-6">
          <div className="container mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
