import React, { createContext, useContext, useState } from 'react';
import { examService } from '../services/examService';

const ExamContext = createContext(null);

export const ExamProvider = ({ children }) => {
  const [exams, setExams] = useState([]);
  const [currentExam, setCurrentExam] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllExams = async () => {
    setLoading(true);
    try {
      const response = await examService.getAllExams();
      setExams(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch exams');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchExamById = async (id) => {
    setLoading(true);
    try {
      const response = await examService.getExamById(id);
      setCurrentExam(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch exam');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createExam = async (examData) => {
    setLoading(true);
    try {
      const response = await examService.createExam(examData);
      setExams([response.data, ...exams]);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create exam');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateExam = async (id, examData) => {
    setLoading(true);
    try {
      const response = await examService.updateExam(id, examData);
      setExams(exams.map(e => e.id === id ? response.data : e));
      if (currentExam && currentExam.id === id) {
        setCurrentExam(response.data);
      }
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update exam');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteExam = async (id) => {
    setLoading(true);
    try {
      await examService.deleteExam(id);
      setExams(exams.filter(e => e.id !== id));
      if (currentExam && currentExam.id === id) {
        setCurrentExam(null);
      }
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete exam');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getQuestionsByFaculties = async (facultyIds) => {
    setLoading(true);
    try {
      const response = await examService.getQuestionsByFaculties(facultyIds);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch questions');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const setExamActive = async (id, isActive) => {
    setLoading(true);
    try {
      const response = await examService.setExamActive(id, isActive);
      setExams(exams.map(e => e.id === id ? response.data : e));
      if (currentExam && currentExam.id === id) {
        setCurrentExam(response.data);
      }
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update exam status');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    exams,
    currentExam,
    loading,
    error,
    fetchAllExams,
    fetchExamById,
    createExam,
    updateExam,
    deleteExam,
    getQuestionsByFaculties,
    setExamActive
  };

  return <ExamContext.Provider value={value}>{children}</ExamContext.Provider>;
};

export const useExams = () => {
  return useContext(ExamContext);
}; 