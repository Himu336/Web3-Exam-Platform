import React, { createContext, useContext, useState } from 'react';
import { resultService } from '../services/resultService';

const ResultContext = createContext(null);

export const ResultProvider = ({ children }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMyResults = async () => {
    setLoading(true);
    try {
      const response = await resultService.getMyResults();
      setResults(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch results');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchAllResults = async () => {
    setLoading(true);
    try {
      const response = await resultService.getAllResults();
      setResults(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch results');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const submitExam = async (examId, answers) => {
    setLoading(true);
    try {
      const response = await resultService.submitExam(examId, answers);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit exam');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const validateResult = async (id, resultData) => {
    setLoading(true);
    try {
      const response = await resultService.validateResult(id, resultData);
      setResults(results.map(r => r.id === id ? response.data : r));
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to validate result');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    results,
    loading,
    error,
    fetchMyResults,
    fetchAllResults,
    submitExam,
    validateResult
  };

  return <ResultContext.Provider value={value}>{children}</ResultContext.Provider>;
};

export const useResults = () => {
  return useContext(ResultContext);
}; 