import api from './api';

export const questionService = {
  // Create a new question
  createQuestion: async (questionData) => {
    return await api.post('/questions', questionData);
  },

  // Get faculty's own questions
  getMyQuestions: async () => {
    return await api.get('/questions/me');
  },

  // Get all questions (admin only)
  getAllQuestions: async () => {
    return await api.get('/questions');
  },

  // Get questions by faculty ID (admin only)
  getQuestionsByFaculty: async (facultyId) => {
    return await api.get(`/questions/faculty/${facultyId}`);
  },

  // Update a question
  updateQuestion: async (id, questionData) => {
    return await api.put(`/questions/${id}`, questionData);
  },

  // Delete a question
  deleteQuestion: async (id) => {
    return await api.delete(`/questions/${id}`);
  },

  // Approve a question (admin only)
  approveQuestion: async (id) => {
    return await api.put(`/questions/${id}`, { isApproved: true });
  }
}; 