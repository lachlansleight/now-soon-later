import { useMemo } from "react";
import { Goal } from "lib/types";
import AutocompleteField from "./AutocompleteField";

const GoalField = ({
    label = "Goal",
    value,
    onChange,
    goals,
}: {
    label?: string;
    value: string | undefined;
    onChange: (newVal: string | undefined) => void;
    goals: Goal[];
}): JSX.Element => {
    const autocompleteOptions = useMemo(() => {
        return goals.map(g => ({ key: g.id, label: g.name }));
    }, [goals]);

    return (
        <AutocompleteField
            label={label}
            value={value || -1}
            onChange={newVal => {
                console.log(newVal);
                if (newVal === -1) onChange(undefined);
                else onChange(newVal as string);
            }}
            autocompleteOptions={autocompleteOptions}
        />
    );
};

export default GoalField;
