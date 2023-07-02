import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import DateOffsetField from "./DateOffsetField";

const DateField = ({
    className,
    label,
    value,
    onChange,
}: {
    className?: string;
    label: string;
    value: Date;
    onChange?: (value: Date) => void;
}): JSX.Element => {
    const [textValue, setTextValue] = useState(
        dayjs(value).startOf("day").add(12, "hour").format("DD/MM/YYYY")
    );
    const isValid = useMemo(() => {
        return dayjs(textValue, "DD/MM/YYYY").isValid();
    }, [textValue]);

    useEffect(() => {
        if (!isValid) return;
        if (!onChange) return;
        onChange(dayjs(textValue, "DD/MM/YYYY").toDate());
    }, [textValue, isValid, onChange]);

    return (
        <DateOffsetField
            value={textValue}
            onChange={setTextValue}
            label={label}
            className={className}
        />
    );
};

export default DateField;
