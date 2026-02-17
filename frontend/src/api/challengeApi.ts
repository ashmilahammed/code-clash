import axiosInstance from "./axiosInstance";
import type {
    CreateChallengePayload,
    CreateChallengeResponse,
    Challenge,
} from "../types/Challenge";
import type { ListQuery } from "../types/ListQuery";
import type { PaginatedResponse } from "./adminApi";



//user
export const getChallengesApi = async (): Promise<Challenge[]> => {
    const res = await axiosInstance.get("/challenges");
    // return res.data.data;
    return res.data.data.data;
};

//
export const getChallengeByIdApi = async (
    id: string
): Promise<Challenge> => {
    const res = await axiosInstance.get(`/challenges/${id}`);
    return res.data.data;
};


// no solution code(only templates)
export const getChallengeTemplatesApi = async (
    challengeId: string
): Promise<{ language: string; starterCode: string }[]> => {
    const res = await axiosInstance.get(
        `/challenges/${challengeId}/templates`
    );
    return res.data.data;
};





// Admin – list challenges
export const getAdminChallengesApi = async (
    query: ListQuery
): Promise<PaginatedResponse<Challenge>> => {
    const res = await axiosInstance.get("/admin/challenges", {
        params: query,
    });

    return res.data.data;
};

// toggle challenge 
export const toggleChallengeStatusApi = async (
    challengeId: string,
    isActive: boolean
): Promise<void> => {
    await axiosInstance.patch(
        // `/challenges/${challengeId}/toggle/status`,
        `/admin/challenges/${challengeId}/status`,
        { isActive }
    );
};



// wizard (admin)
export const createChallengeBasicApi = async (
    payload: CreateChallengePayload
): Promise<CreateChallengeResponse> => {
    const res = await axiosInstance.post("/admin/challenges", payload);
    return res.data.data; // { id, status }
};

export const updateChallengeBasicApi = async (
    id: string,
    payload: Partial<CreateChallengePayload>
): Promise<CreateChallengeResponse> => {
    const res = await axiosInstance.patch(`/admin/challenges/${id}`, payload);
    return res.data.data;
};


export const addChallengeTagsApi = async (
    challengeId: string,
    tags: string[]
) => {
    await axiosInstance.post(
        `/admin/challenges/${challengeId}/tags`,
        { tags }
    );
};


// export const getLanguagesApi = async () => {
//     const res = await axiosInstance.get("/challenges/languages");
//     return res.data.data;
// };

export const getAvailableLanguagesApi = async () => {
    const res = await axiosInstance.get("/challenges/languages");
    return res.data.data;
};

export const getChallengeLanguagesApi = async (
    challengeId: string
): Promise<string[]> => {
    const res = await axiosInstance.get(
        `/admin/challenges/${challengeId}/languages`
    );
    return res.data.data;
};


export const addChallengeLanguagesApi = async (
    challengeId: string,
    languages: string[]
) => {
    await axiosInstance.post(
        `/admin/challenges/${challengeId}/languages`,
        { languages }
    );
};


export const addChallengeTestCasesApi = async (
    challengeId: string,
    testCases: {
        input: string;
        expectedOutput: string;
        isSample?: boolean;
    }[]
) => {
    await axiosInstance.post(
        `/admin/challenges/${challengeId}/test-cases`,
        { testCases }
    );
};



export const addChallengeHintsApi = async (
    challengeId: string,
    hints: {
        order: number;
        content: string;
        unlockAfterMinutes?: number;
    }[]
) => {
    await axiosInstance.post(
        `/admin/challenges/${challengeId}/hints`,
        { hints }
    );
};



export const updateChallengeScheduleApi = async (
    challengeId: string,
    schedule: {
        availableFrom?: string | null;
        availableUntil?: string | null;
    }
) => {
    await axiosInstance.patch(
        `/admin/challenges/${challengeId}/schedule`,
        schedule
    );
};


//
export const saveCodeTemplatesApi = async (
    challengeId: string,
    templates: {
        language: string;
        starterCode: string;
        solutionCode: string;
    }[]
) => {
    await axiosInstance.post(
        `/admin/challenges/${challengeId}/code-templates`,
        { templates }
    );
};

export const getAdminChallengeTemplatesApi = async (
    challengeId: string
): Promise<{ language: string; starterCode: string; solutionCode: string }[]> => {
    const res = await axiosInstance.get(
        `/admin/challenges/${challengeId}/code-templates`
    );
    return res.data.data;
};





// 
export const getChallengeHintsApi = async (
    challengeId: string
): Promise<{ order: number; content: string; unlockAfterMinutes?: number }[]> => {
    const res = await axiosInstance.get(`/challenges/${challengeId}/hints`);
    return res.data.data;
};

export const getChallengeTestCasesApi = async (
    challengeId: string
): Promise<{ input: string; expectedOutput: string }[]> => {
    const res = await axiosInstance.get(`/challenges/${challengeId}/test-cases`);
    return res.data.data;
};
export const getAdminChallengeTestCasesApi = async (
    challengeId: string
): Promise<{ input: string; expectedOutput: string; isSample: boolean }[]> => {
    const res = await axiosInstance.get(`/admin/challenges/${challengeId}/test-cases`);
    return res.data.data;
};
