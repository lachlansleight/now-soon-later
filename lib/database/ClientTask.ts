import axios from "axios";
import { Task } from "lib/types";
import DatabaseUtils from "./utils";

class ClientTask {
    private static readonly baseUrl = (process.env.NEXT_PUBLIC_FIREBASE_DATABASE || "") + "/tasks";

    public static async get(id: string) {
        if (!id) throw new Error("No id provided");
        let data = (await axios(`${ClientTask.baseUrl}/${id}.json`)).data;
        data = DatabaseUtils.deserializeDates(data);
        return data;
    }

    public static async post(task: Task) {
        if (!task) throw new Error("No task provided");
        const newId = (await axios.post(`${ClientTask.baseUrl}.json`, { temp: true })).data.name;
        task.id = newId;
        const data = (await axios.put(`${ClientTask.baseUrl}/${newId}.json`, task)).data;
        return data;
    }

    public static async patch(task: Partial<Task>) {
        if (!task) throw new Error("No task provided");
        const data = (await axios.patch(`${ClientTask.baseUrl}/${task.id}.json`, task)).data;
        return data;
    }

    public static async delete(id: string) {
        if (!id) throw new Error("No id provided");
        const data = (await axios.delete(`${ClientTask.baseUrl}/${id}.json`)).data;
        return data;
    }
}

export default ClientTask;
