import { Task } from "@prisma/client";
import { useEffect, useMemo } from "react";
import useSWR from "swr";
import { useTimersStore } from "./useTimersStore";

type Response = {
  data: {
    tasks: Task[];
  };
};

export default function useTasks() {
  const { data, mutate } = useSWR<Response>("/api/tasks", async (url) => {
    const response = await fetch(url);
    return await response.json();
  }) as {
    data: Response | undefined;
    mutate: (data?: Response | Promise<Response>) => void;
  };

  const tasks = useMemo(() => {
    return data ? data.data.tasks : [];
  }, [data]);

  const { addTimer, clearTimers } = useTimersStore(
    ({ addTimer, clearTimers }) => ({ addTimer, clearTimers })
  );

  useEffect(() => {
    clearTimers();
    console.log("setting timers");
    tasks.forEach((task) => {
      addTimer(task);
    });
  }, [addTimer, clearTimers, tasks]);

  return {
    tasks,
    mutate,
  };
}
