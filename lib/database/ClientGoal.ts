import axios from "axios";
import { Goal } from "lib/types";

class ClientGoal {
    private static readonly baseUrl = (process.env.NEXT_PUBLIC_FIREBASE_DATABASE || "") + "/goals";

    public static async get(id: string) {
        if (!id) throw new Error("No id provided");
        const data = (await axios(`${ClientGoal.baseUrl}/${id}.json`)).data;
        return data;
    }

    public static async post(goal: Goal) {
        if (!goal) throw new Error("No goal provided");
        console.log(`${ClientGoal.baseUrl}.json`);
        const newId = (await axios.post(`${ClientGoal.baseUrl}.json`, { temp: true })).data.name;
        console.log({ newId });
        goal.id = newId;
        const data = (await axios.put(`${ClientGoal.baseUrl}/${newId}.json`, goal)).data;
        return data;
    }

    public static async patch(goal: Partial<Goal>) {
        if (!goal) throw new Error("No goal provided");
        const data = (await axios.patch(`${ClientGoal.baseUrl}/${goal.id}.json`, goal)).data;
        return data;
    }

    public static async delete(id: string) {
        if (!id) throw new Error("No id provided");
        const data = (await axios.delete(`${ClientGoal.baseUrl}/${id}.json`)).data;
        return data;
    }
}

export default ClientGoal;
