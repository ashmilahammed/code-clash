import axiosInstance from "./axiosInstance";


export const runCodeApi = async (payload: {
  language: string;
  code: string;
  input: string;
}) => {
  const res = await axiosInstance.post("/submissions/run", payload);
  return res.data.data;
};


export const submitSolutionApi = async (payload: {
  challengeId: string;
  language: string;
  code: string;
}) => {
  const res = await axiosInstance.post("/submissions/submit", payload);
  return res.data.data;
};
