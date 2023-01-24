import { Task } from "@prisma/client";
import { useEffect } from "react";
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

  const { addTimer, clearTimers } = useTimersStore(
    ({ addTimer, clearTimers }) => ({ addTimer, clearTimers })
  );

  useEffect(() => {
    clearTimers();
    console.log("setting timers");
    if (data) {
      data.data.tasks.forEach((task) => {
        addTimer(task);
      });
    }
  }, [addTimer, clearTimers, data]);

  return {
    tasks: data ? data.data.tasks : [],
  };
}
