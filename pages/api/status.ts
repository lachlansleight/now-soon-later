import { NextApiRequest, NextApiResponse } from "next";
import { NextRestApiRoute, RestError } from "lib/NextRestApiRoute";
import ClientTask from "lib/database/ClientTask";
import { Task } from "lib/types";

const api = new NextRestApiRoute("/example");

api.get = async (req, res) => {
    const id = req.query.id as string;
    if (!id) throw new RestError("No ID provided", 400);
    const task = await ClientTask.get(id);
    res.status(200).json(task);
};

api.post = async (req, res) => {
    const task = req.body.task as Task;
    if (!task) throw new RestError("No task provided", 400);
    const newtask = await ClientTask.post(task);
    res.status(200).json(newtask);
};

api.patch = async (req, res) => {
    const task = req.body.task as Partial<Task>;
    if (!task) throw new RestError("No task provided", 400);
    const newtask = await ClientTask.patch(task);
    res.status(200).json(newtask);
};

api.delete = async (req, res) => {
    const id = req.query.id as string;
    if (!id) throw new RestError("No ID provided", 400);
    const task = await ClientTask.delete(id);
    res.status(200).json(task);
};

export default (req: NextApiRequest, res: NextApiResponse) => api.handle(req, res);
