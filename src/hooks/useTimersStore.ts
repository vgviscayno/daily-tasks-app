import { Task } from "@prisma/client";
import { create } from "zustand";

type Timer = {
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

export const useTimersStore = create<TimersState>((set) => ({
  timers: [],
  addTimer: (task: Task) =>
    set((state) => ({
      ...state,
      timers: [
        ...state.timers,
        {
          ...task,
          minutesRemaining: task.minutes,
          seconds: 0,
          isRunning: false,
          intervalId: null,
        },
      ],
    })),
  clearTimers: () => set({ timers: [] }),
  startTimer: (taskId: number) =>
    set((state) => {
      const timers = state.timers.map((timer) => {
        if (timer.id === taskId) {
          timer.isRunning = true;
          timer.intervalId = window.setInterval(() => {
            console.log("tick tock");
            timer.seconds--;
            if (timer.seconds < 0) {
              timer.minutesRemaining--;
              timer.seconds = 59;
            }
            if (timer.minutesRemaining < 0) {
              timer.minutesRemaining = 0;
              timer.seconds = 0;
              timer.isRunning = false;
              if (timer.intervalId) {
                window.clearInterval(timer.intervalId);
              }
            }
          }, 1000);
        }
        return timer;
      });

      return { ...state, timers: [...timers] };
    }),
  pauseTimer: (taskId) =>
    set((state) => {
      const timers = state.timers.map((timer) => {
        if (timer.id === taskId) {
          timer.isRunning = false;
          if (timer.intervalId) {
            window.clearInterval(timer.intervalId);
          }
        }
        return timer;
      });
      return { ...state, timers: [...timers] };
    }),
  stopTimer: (timerId) =>
    set((state) => {
      const timers = state.timers.map((timer) => {
        if (timer.id === timerId) {
          timer.isRunning = false;
          if (timer.intervalId) {
            window.clearInterval(timer.intervalId);
          }
          timer.minutesRemaining = timer.minutes;
          timer.seconds = 0;
        }
        return timer;
      });
      return { ...state, timers: [...timers] };
    }),
}));
