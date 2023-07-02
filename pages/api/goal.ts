import { NextApiRequest, NextApiResponse } from "next";
import { NextRestApiRoute, RestError } from "lib/NextRestApiRoute";
import ClientGoal from "lib/database/ClientGoal";
import { Goal } from "lib/types";

const api = new NextRestApiRoute("/goal");

api.get = async (req, res) => {
    const id = req.query.id as string;
    if (!id) throw new RestError("No ID provided", 400);
    const goal = await ClientGoal.get(id);
    res.status(200).json(goal);
};

api.post = async (req, res) => {
    const goal = req.body as Goal;
    if (!goal) throw new RestError("No goal provided", 400);
    const newGoal = await ClientGoal.post(goal);
    res.status(200).json(newGoal);
};

api.patch = async (req, res) => {
    const goal = req.body.goal as Partial<Goal>;
    if (!goal) throw new RestError("No goal provided", 400);
    const newGoal = await ClientGoal.patch(goal);
    res.status(200).json(newGoal);
};

api.delete = async (req, res) => {
    const id = req.query.id as string;
    if (!id) throw new RestError("No ID provided", 400);
    const goal = await ClientGoal.delete(id);
    res.status(200).json(goal);
};

export default (req: NextApiRequest, res: NextApiResponse) => api.handle(req, res);
