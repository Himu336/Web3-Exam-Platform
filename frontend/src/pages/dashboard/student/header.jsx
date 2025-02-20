const Header = ({ activeSection }) => {
  const dashboardSections = {
    'Take Exam': 'Start your scheduled examination',
    'Result': 'View your examination results',
    'Exam Schedule': 'Check your upcoming exams',
    'Student Profile': 'View and edit your profile'
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 flex-shrink-0">
      <div className="px-6 py-4 flex justify-between items-center">
        {/* Left side - Title */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {activeSection}
          </h1>
          <p className="text-gray-600 mt-1">
            {dashboardSections[activeSection]}
          </p>
        </div>

        {/* Right side - Mini Profile Card */}
        <div className="flex items-center bg-gray-50 rounded-lg p-2 border border-gray-200 shadow-sm hover:bg-gray-100 transition-colors">
          <div className="flex items-center space-x-3 flex-row-reverse">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-200 ml-2">
              <img 
                src="https://placekitten.com/100/100"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-sm text-right flex flex-col items-end">
              <p className="font-medium text-gray-900 w-24 text-center">CS2023001</p>
              <p className="text-gray-500 text-xs w-24 text-center">Student</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
