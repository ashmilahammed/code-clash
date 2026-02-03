import axiosInstance from "./axiosInstance";
import type { Challenge } from "../types/Challenge";



export const getChallengesApi = async (): Promise<Challenge[]> => {
  const res = await axiosInstance.get("/challenges");
  return res.data.challenges;
};


export const getChallengeByIdApi = async (
  id: string
): Promise<Challenge> => {
  const res = await axiosInstance.get(`/challenges/${id}`);
  return res.data.challenge;
};
