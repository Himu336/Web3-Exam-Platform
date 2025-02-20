import { useNavigate } from 'react-router-dom';
import { logout } from '../../../services/auth.service';

const Sidebar = ({ activeSection, setActiveSection }) => {
  const navigate = useNavigate();

  const dashboardSections = [
    {
      title: 'Take Exam',
      icon: '📝',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-500'
    },
    {
      title: 'Result',
      icon: '📊',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-500'
    },
    {
      title: 'Exam Schedule',
      icon: '📅',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-500'
    },
    {
      title: 'Student Profile',
      icon: '👤',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-500'
    }
  ];

  const handleLogout = () => {
    logout();
    navigate('/auth/student');
  };

  return (
    <div className="w-64 h-screen flex flex-col bg-white border-r border-gray-200 flex-shrink-0">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">Student Portal</h1>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          {dashboardSections.map((section) => (
            <li key={section.title}>
              <button
                onClick={() => setActiveSection(section.title)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                  ${activeSection === section.title 
                    ? `${section.bgColor} ${section.borderColor} border-l-4` 
                    : 'hover:bg-gray-50'
                  }`}
              >
                <span className="text-2xl">{section.icon}</span>
                <span className={`font-medium ${
                  activeSection === section.title ? 'text-gray-900' : 'text-gray-600'
                }`}>
                  {section.title}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-200 mt-auto">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
