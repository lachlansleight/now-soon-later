import { useMemo } from "react";
import { Goal } from "lib/types";
import AutocompleteField from "./AutocompleteField";

const GoalField = ({
    value,
    onChange,
    goals,
}: {
    value: string | undefined;
    onChange: (newVal: string | undefined) => void;
    goals: Goal[];
}): JSX.Element => {
    const autocompleteOptions = useMemo(() => {
        return goals.map(g => ({ key: g.id, label: g.name }));
    }, [goals]);

    return (
        <AutocompleteField
            label="Goal"
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
