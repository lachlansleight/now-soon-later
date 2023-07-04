import { NextApiRequest, NextApiResponse } from "next";
import { NextRestApiRoute } from "lib/NextRestApiRoute";
import ClientGoal from "lib/database/ClientGoal";

const api = new NextRestApiRoute("/goals");

api.get = async (req, res) => {
    const goal = await ClientGoal.getMany();
    res.status(200).json(goal);
};

export default (req: NextApiRequest, res: NextApiResponse) => api.handle(req, res);
