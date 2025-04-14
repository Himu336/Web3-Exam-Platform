import api from './api';

export const examService = {
  // Create a new exam (admin only)
  createExam: async (examData) => {
    return await api.post('/exams', examData);
  },

  // Get all exams
  getAllExams: async () => {
    return await api.get('/exams');
  },

  // Get exam by ID
  getExamById: async (id) => {
    return await api.get(`/exams/${id}`);
  },

  // Update an exam (admin only)
  updateExam: async (id, examData) => {
    return await api.put(`/exams/${id}`, examData);
  },

  // Delete an exam (admin only)
  deleteExam: async (id) => {
    return await api.delete(`/exams/${id}`);
  },

  // Get questions by selected faculties (admin only)
  getQuestionsByFaculties: async (facultyIds) => {
    return await api.post('/exams/questions', { facultyIds });
  },

  // Activate/deactivate an exam
  setExamActive: async (id, isActive) => {
    return await api.put(`/exams/${id}`, { isActive });
  }
}; 