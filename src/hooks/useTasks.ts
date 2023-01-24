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
  const { data } = useSWR<Response>("/api/tasks", async (url) => {
    const response = await fetch(url);
    return await response.json();
  }) as {
    data: Response | undefined;
  };

  const { addTimer, clearTimers } = useTimersStore(
    ({ addTimer, clearTimers }) => ({ addTimer, clearTimers })
  );

  useEffect(() => {
    clearTimers();
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
