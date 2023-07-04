import { NextApiRequest, NextApiResponse } from "next";
import { NextRestApiRoute } from "lib/NextRestApiRoute";
import ClientTask from "lib/database/ClientTask";

const api = new NextRestApiRoute("/tasks");

api.get = async (req, res) => {
    const goal = await ClientTask.getMany();
    res.status(200).json(goal);
};

export default (req: NextApiRequest, res: NextApiResponse) => api.handle(req, res);
