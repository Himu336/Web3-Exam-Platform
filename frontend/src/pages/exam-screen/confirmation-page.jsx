import React from 'react';
import { useNavigate } from 'react-router-dom';

const ConfirmationPage = ({ examId }) => {
  const navigate = useNavigate();

  const instructions = [
    "Please read all instructions carefully before starting the exam:",
    "The exam consists of multiple-choice questions.",
    "Each question has only one correct answer.",
    "You can mark questions for review and return to them later.",
    "The timer will start as soon as you begin the exam.",
    "Once you submit the exam, you cannot return to it.",
    "Ensure you have a stable internet connection.",
    "Do not refresh the page during the exam.",
    "Do not switch tabs or windows during the exam."
  ];

  const examFormat = [
    "Total Questions: 20",
    "Time Duration: 6 hours",
    "Marking Scheme: 1 mark per correct answer",
    "No negative marking for wrong answers"
  ];

  const rules = [
    "This is a closed book examination.",
    "Any form of malpractice will result in immediate disqualification.",
    "Keep your webcam on throughout the examination.",
    "Maintain silence during the examination.",
    "In case of technical issues, contact the exam coordinator immediately."
  ];

  const handleStartExam = () => {
    navigate(`/student/exam/${examId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <span className="text-xl font-semibold text-blue-600">Web3-Exam-Platform</span>
            <h1 className="text-xl font-semibold text-gray-800">Exam Instructions</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-8">
          {/* Instructions Section */}
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Instructions</h2>
            <ul className="list-disc pl-5 space-y-2">
              {instructions.map((instruction, index) => (
                <li key={index} className="text-gray-600">{instruction}</li>
              ))}
            </ul>
          </section>

          {/* Exam Format Section */}
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Exam Format</h2>
            <ul className="list-disc pl-5 space-y-2">
              {examFormat.map((format, index) => (
                <li key={index} className="text-gray-600">{format}</li>
              ))}
            </ul>
          </section>

          {/* Rules Section */}
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Rules & Regulations</h2>
            <ul className="list-disc pl-5 space-y-2">
              {rules.map((rule, index) => (
                <li key={index} className="text-gray-600">{rule}</li>
              ))}
            </ul>
          </section>

          {/* Declaration */}
          <section className="bg-blue-50 p-4 rounded-lg">
            <p className="text-gray-700">
              By clicking "Start Exam", you agree that you have read and understood all the instructions, 
              rules, and regulations mentioned above. You also agree to abide by these rules throughout 
              the examination.
            </p>
          </section>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              onClick={() => navigate('/student/dashboard')}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleStartExam}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Start Exam
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
