import { callApi } from "./apiResponse.ts";
import type { Task } from "@piano_supporter/common/domains/task.ts";
import { client } from "./apiClient";
import type { Result } from "@piano_supporter/common/lib/error.ts";
import type { createTaskData } from "@piano_supporter/common/commonResponseType/honoRequest.ts";

export const getTaskClient = async (practiceId: string):Promise<Result<Task[]>> => {
    const result = await callApi<Task[]>(() =>
		client["task"][":practiceId"].$get({
			param: {
				practiceId,
			},
		})
	);
	return result;
}

export const createTaskApi = async (data: createTaskData): Promise<Result<Task>> => {
	const result = await callApi<Task>(() =>
		client["task"].$post({
			json: data,
		})
	);
	return result;
}