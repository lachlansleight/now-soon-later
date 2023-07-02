import { Item } from "lib/types";

class DatabaseUtils {
    /** Ensures dates are turned from string representations back into dates */
    public static deserializeDates(data: Item) {
        data.createdAt = new Date(data.createdAt);
        if (data.completedAt) data.completedAt = new Date(data.completedAt);
        data.targetDate = new Date(data.targetDate);
        data.extendedFrom = data.extendedFrom?.map(date => new Date(date));
        data.additionalComments = data.additionalComments?.map(comment => {
            comment.date = new Date(comment.date);
            return comment;
        });
        return data;
    }
}

export default DatabaseUtils;
