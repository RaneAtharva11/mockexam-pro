import api from './axios';

export const getResult = (attemptId: number) =>
  api.get(`/api/results/${attemptId}`);

export const getExplanations = (attemptId: number) =>
  api.get(`/api/results/${attemptId}/explanations`);
