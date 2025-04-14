import React, { useState } from 'react';
import { useQuestions } from '../../../contexts/QuestionContext';
import { useNavigate } from 'react-router-dom';

const CreateQuestion = () => {
  const { createQuestion, loading, error } = useQuestions();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    questionText: '',
    options: [
      { text: '' },
      { text: '' },
      { text: '' },
      { text: '' }
    ],
    correctOptionIndex: 0,
    marks: 1,
    difficulty: 'medium',
    subject: '',
    topic: ''
  });

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index].text = value;
    setFormData({
      ...formData,
      options: newOptions
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await createQuestion({
        questionText: formData.questionText,
        options: formData.options,
        correctOptionIndex: parseInt(formData.correctOptionIndex),
        marks: parseInt(formData.marks),
        difficulty: formData.difficulty,
        subject: formData.subject,
        topic: formData.topic
      });
      
      navigate('/faculty/dashboard/question-bank');
    } catch (err) {
      console.error('Failed to create question:', err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-6">Create New Question</h2>
      
      {error && <div className="bg-red-100 p-3 rounded-md text-red-600 mb-4">{error}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Question Text
          </label>
          <textarea
            required
            value={formData.questionText}
            onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            placeholder="Enter your question here..."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Options
          </label>
          <div className="space-y-3">
            {formData.options.map((option, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="radio"
                  name="correctOption"
                  value={index}
                  checked={parseInt(formData.correctOptionIndex) === index}
                  onChange={() => setFormData({ ...formData, correctOptionIndex: index })}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 mr-2"
                />
                <input
                  type="text"
                  required
                  value={option.text}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder={`Option ${index + 1}`}
                />
              </div>
            ))}
          </div>
          <p className="mt-1 text-sm text-gray-500">Select the radio button for the correct option.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject
            </label>
            <input
              type="text"
              required
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="e.g. Mathematics, Computer Science"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Topic
            </label>
            <input
              type="text"
              required
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="e.g. Algebra, Data Structures"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Difficulty
            </label>
            <select
              value={formData.difficulty}
              onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Marks
            </label>
            <input
              type="number"
              min="1"
              required
              value={formData.marks}
              onChange={(e) => setFormData({ ...formData, marks: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/faculty/dashboard/question-bank')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            {loading ? 'Creating...' : 'Create Question'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateQuestion; 