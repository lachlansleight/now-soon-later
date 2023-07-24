import { useMemo } from "react";
import GoalListItem from "components/items/GoalListItem";
import Data from "lib/clientData/Data";
import { Goal, HierarchyGoal } from "lib/types";
import GoalUtils from "lib/GoalUtils";

const GoalsPage = ({
    data,
    onGoalClick,
}: {
    data: Data;
    onGoalClick: (goal: Goal) => void;
}): JSX.Element => {
    const goalHierarchy = useMemo(() => {
        return GoalUtils.getGoalHierarchy(data.goals);
    }, [data]);

    const goalList = useMemo(() => {
        //console.log(goalHierarchy);
        const getChildren = (
            goal: HierarchyGoal,
            currentChildren: JSX.Element[]
        ): JSX.Element[] => {
            currentChildren = [
                ...currentChildren,
                <GoalListItem
                    key={goal.id}
                    goal={goal}
                    onClick={onGoalClick}
                    style={{
                        marginLeft: GoalUtils.getGoalDepth(goal, data.goals) * 24,
                    }}
                />,
            ];

            if (!goal.childGoals || goal.childGoals.length === 0) {
                return [...currentChildren];
            } else {
                for (let i = 0; i < goal.childGoals.length; i++) {
                    currentChildren = getChildren(goal.childGoals[i], [...currentChildren]);
                }
            }

            return [...currentChildren];
        };

        return goalHierarchy
            .map(g => getChildren(g, []))
            .reduce((prev, cur) => [...prev, ...cur], []);
    }, [goalHierarchy, onGoalClick]);

    return (
        <>
            <div className="flex flex-col gap-2">{goalList}</div>
        </>
    );
};

export default GoalsPage;
