import { useMemo } from "react";
import dayjs from "dayjs";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import Layout from "components/layout/Layout";
import ClientGoal from "lib/database/ClientGoal";
import { Goal } from "lib/types";
import DatabaseUtils from "lib/database/utils";

const GoalPage = ({ serverGoal }: { serverGoal: Goal }): JSX.Element => {
    const goal = useMemo(() => DatabaseUtils.deserializeDates(serverGoal), [serverGoal]);
    return (
        <Layout>
            <h1 className="text-2xl">{goal.name}</h1>
            <p>Created {dayjs(goal.createdAt).format("DD MMMM YYYY")}</p>
            <p>Target {dayjs(goal.targetDate).format("DD MMMM YYYY")}</p>
        </Layout>
    );
};

export default GoalPage;
export async function getServerSideProps(
    ctx: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<{ serverGoal: Goal }>> {
    const goal = await ClientGoal.get(ctx.query.goalId as string);
    console.log(goal);
    if (!goal) {
        return {
            notFound: true,
        };
    }
    return {
        props: {
            serverGoal: goal,
        },
    };
}
