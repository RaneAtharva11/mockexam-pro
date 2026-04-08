import api from './axios';

export const getAllExams = () => api.get('/api/exams');

export const getQuestions = (examId: number, paperId: number) =>
  api.get(`/api/exams/${examId}/papers/${paperId}/questions`);
