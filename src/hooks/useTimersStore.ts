import { Task } from "@prisma/client";
import { create } from "zustand";

type Timer = {
  minutesElapsed: number;
  minutesRemaining: number;
  seconds: number;
  isRunning: boolean;
  intervalId: number | null;
} & Task;

interface TimersState {
  timers: Timer[];
  addTimer: (task: Task) => void;
  clearTimers: () => void;
  startTimer: (taskId: number) => void;
  pauseTimer: (taskId: number) => void;
  stopTimer: (taskId: number) => void;
}

export const useTimersStore = create<TimersState>((set) => {
  const addTimer = (task: Task) => {
    set((state) => {
      return {
        ...state,
        timers: [
          ...state.timers,
          {
            ...task,
            minutesRemaining: task.minutes,
            seconds: 0,
            minutesElapsed: 0,
            isRunning: false,
            intervalId: null,
          },
        ],
      };
    });
  };

  const decrementTimer = (timer: Timer): Timer => {
    if (timer.seconds === 0) {
      if (timer.minutesRemaining === 0) {
        if (timer.intervalId) {
          window.clearInterval(timer.intervalId);
        }
        return {
          ...timer,
          isRunning: false,
          seconds: 0,
          minutesRemaining: 0,
          minutesElapsed: timer.minutes,
        };
      } else {
        return {
          ...timer,
          minutesRemaining: timer.minutesRemaining - 1,
          minutesElapsed:
            timer.minutesRemaining <= timer.minutes - 1
              ? timer.minutesElapsed + 1
              : timer.minutesElapsed,
          seconds: 59,
        };
      }
    } else {
      return {
        ...timer,
        minutesRemaining: timer.minutesRemaining,
        seconds: timer.seconds - 1,
      };
    }
  };

  const clearTimers = () => set({ timers: [] });

  const startTimer = (taskId: number) => {
    const intervalId = window.setInterval(() => {
      set((state) => {
        let timer = state.timers.find((timer) => timer.id === taskId);

        if (!timer) {
          return { ...state };
        }

        timer = decrementTimer(timer);
        return {
          ...state,
          timers: [
            ...state.timers.filter((timer) => timer.id !== taskId),
            timer,
          ],
        };
      });
    }, 1000);
    set((state) => {
      let timer = state.timers.find((timer) => timer.id === taskId);
      if (!timer) {
        return { ...state };
      }

      return {
        ...state,
        timers: [
          ...state.timers.filter((timer) => timer.id !== taskId),
          {
            ...timer,
            intervalId,
            isRunning: true,
          },
        ],
      };
    });
  };

  const pauseTimer = (taskId: number) => {
    set((state) => {
      let timer = state.timers.find((timer) => timer.id === taskId);
      if (!timer) {
        return { ...state };
      }

      if (timer.intervalId) {
        window.clearInterval(timer.intervalId);
      }

      return {
        ...state,
        timers: [
          ...state.timers.filter((timer) => timer.id !== taskId),
          {
            ...timer,
            isRunning: false,
          },
        ],
      };
    });
  };

  const stopTimer = (taskId: number) => {
    set((state) => {
      let timer = state.timers.find((timer) => timer.id === taskId);
      if (!timer) {
        return { ...state };
      }

      if (timer.intervalId) {
        window.clearInterval(timer.intervalId);
      }

      return {
        ...state,
        timers: [
          ...state.timers.filter((timer) => timer.id !== taskId),
          {
            ...timer,
            isRunning: false,
            minutesRemaining: timer.minutes,
            minutesElapsed: 0,
            seconds: 0,
          },
        ],
      };
    });
  };

  return {
    timers: [],
    addTimer,
    clearTimers,
    startTimer,
    pauseTimer,
    stopTimer,
  };
});
