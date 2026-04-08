import api from './axios';

export const startAttempt = (examId: number) =>
  api.post(`/api/attempts/start?examId=${examId}`);

export const getAttemptStatus = (attemptId: number) =>
  api.get(`/api/attempts/${attemptId}/status`);

export const saveResponse = (attemptId: number, data: { questionId: number; selectedOption: string | null }) =>
  api.put(`/api/attempts/${attemptId}/response`, data);

export const submitAttempt = (attemptId: number) =>
  api.post(`/api/attempts/${attemptId}/submit`);
