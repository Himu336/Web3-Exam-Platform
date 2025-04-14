import React, { createContext, useContext, useState } from 'react';
import { questionService } from '../services/questionService';

const QuestionContext = createContext(null);

export const QuestionProvider = ({ children }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMyQuestions = async () => {
    setLoading(true);
    try {
      const response = await questionService.getMyQuestions();
      // Parse options JSON if it exists and is a string
      const processedQuestions = response.data.map(question => {
        if (question.options && typeof question.options === 'string') {
          try {
            question.options = JSON.parse(question.options);
          } catch (err) {
            console.error('Error parsing options JSON:', err);
          }
        }
        return question;
      });
      setQuestions(processedQuestions);
      setError(null);
      return processedQuestions;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch questions');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchAllQuestions = async () => {
    setLoading(true);
    try {
      const response = await questionService.getAllQuestions();
      // Parse options JSON if it exists and is a string
      const processedQuestions = response.data.map(question => {
        if (question.options && typeof question.options === 'string') {
          try {
            question.options = JSON.parse(question.options);
          } catch (err) {
            console.error('Error parsing options JSON:', err);
          }
        }
        return question;
      });
      setQuestions(processedQuestions);
      setError(null);
      return processedQuestions;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch questions');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestionsByFaculty = async (facultyId) => {
    setLoading(true);
    try {
      const response = await questionService.getQuestionsByFaculty(facultyId);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch questions');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createQuestion = async (questionData) => {
    setLoading(true);
    try {
      const response = await questionService.createQuestion(questionData);
      setQuestions([response.data, ...questions]);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create question');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateQuestion = async (id, questionData) => {
    setLoading(true);
    try {
      const response = await questionService.updateQuestion(id, questionData);
      setQuestions(questions.map(q => q.id === id ? response.data : q));
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update question');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteQuestion = async (id) => {
    setLoading(true);
    try {
      await questionService.deleteQuestion(id);
      setQuestions(questions.filter(q => q.id !== id));
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete question');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const approveQuestion = async (id) => {
    setLoading(true);
    try {
      const response = await questionService.approveQuestion(id);
      setQuestions(questions.map(q => q.id === id ? response.data : q));
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve question');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    questions,
    loading,
    error,
    fetchMyQuestions,
    fetchAllQuestions,
    fetchQuestionsByFaculty,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    approveQuestion
  };

  return <QuestionContext.Provider value={value}>{children}</QuestionContext.Provider>;
};

export const useQuestions = () => {
  return useContext(QuestionContext);
}; 