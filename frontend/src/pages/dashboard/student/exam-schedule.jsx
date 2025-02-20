const ExamSchedule = () => {
  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold mb-6">Upcoming Examinations</h3>
      <div className="space-y-4">
        <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
          <h4 className="text-lg font-semibold">Algorithm Analysis</h4>
          <div className="mt-2 space-y-2">
            <p className="text-gray-600">Date: March 1, 2024</p>
            <p className="text-gray-600">Time: 10:00 AM</p>
            <p className="text-gray-600">Duration: 3 hours</p>
          </div>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
          <h4 className="text-lg font-semibold">Database Management</h4>
          <div className="mt-2 space-y-2">
            <p className="text-gray-600">Date: March 5, 2024</p>
            <p className="text-gray-600">Time: 2:00 PM</p>
            <p className="text-gray-600">Duration: 2 hours</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamSchedule; 