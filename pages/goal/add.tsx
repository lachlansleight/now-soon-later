import axios from "axios";
import { useState } from "react";
import { FaSync } from "react-icons/fa";
import { useRouter } from "next/router";
import GoalForm from "components/forms/GoalForm";
import Layout from "components/layout/Layout";
import { Goal } from "lib/types";

const AddGoalPage = (): JSX.Element => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleGoal = async (goal: Goal) => {
        setLoading(true);
        const result = await axios.post("/api/goal", goal);
        if (result) {
            console.log("Got result!", result);
            router.push(`/goal/${result.data.id}`);
        }
        setLoading(false);
    };

    return (
        <Layout>
            {loading ? (
                <div className="h-48 grid place-items-center">
                    <FaSync className="animate-spin text-2xl" />
                </div>
            ) : (
                <GoalForm onSubmit={handleGoal} />
            )}
        </Layout>
    );
};

export default AddGoalPage;
