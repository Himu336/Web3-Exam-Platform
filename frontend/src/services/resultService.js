import api from './api';

export const resultService = {
  // Submit exam results (student)
  submitExam: async (examId, answers) => {
    return await api.post('/results', { examId, answers });
  },

  // Get student's own results (student)
  getMyResults: async () => {
    return await api.get('/results/me');
  },

  // Get all results (admin/faculty)
  getAllResults: async () => {
    return await api.get('/results');
  },

  // Validate a result (faculty/admin)
  validateResult: async (id, resultData) => {
    return await api.put(`/results/${id}`, resultData);
  }
}; 