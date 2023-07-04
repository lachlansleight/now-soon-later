import { ReactNode, createContext, useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import { Task, Goal } from "lib/types";
import Data from "lib/clientData/Data";

export type DataContext = {
    loading: boolean;
    data: Data | null;
    revalidate: () => Promise<void>;
};

const defaultContextValue = {
    loading: false,
    data: null,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    revalidate: async () => {},
};

const dataContext = createContext<DataContext>(defaultContextValue);

const DataContextProvider = ({ children }: { children: ReactNode }) => {
    const [value, setValue] = useState<DataContext>(defaultContextValue);
    const revalidate = useCallback(async () => {
        if (value.loading) return;

        setValue(cur => ({
            ...cur,
            loading: true,
        }));
        console.log("Loading data");
        const fetchTasks = axios("/api/tasks");
        const fetchGoals = axios("/api/goals");
        const responses = await Promise.all([fetchTasks, fetchGoals]);
        const data = new Data(
            Object.values(responses[0].data || {}) as Task[],
            Object.values(responses[1].data || {}) as Goal[]
        );
        setValue(cur => ({
            ...cur,
            loading: false,
            data,
        }));
    }, [value.loading]);

    useEffect(() => {
        revalidate();
    }, []);

    return <dataContext.Provider value={{ ...value, revalidate }}>{children}</dataContext.Provider>;
};

const useData = () => {
    const context = useContext(dataContext);
    return context;
};

export { DataContextProvider };
export default useData;
