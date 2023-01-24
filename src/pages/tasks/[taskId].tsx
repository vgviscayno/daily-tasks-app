import MainLayout from "@/components/MainLayout";
import { useTimersStore } from "@/hooks/useTimersStore";
import {
  ClockIcon,
  PauseCircleIcon,
  PlayCircleIcon,
  StopCircleIcon,
} from "@heroicons/react/24/outline";
import { Task } from "@prisma/client";

import { useRouter } from "next/router";
import { shallow } from "zustand/shallow";

type Response = {
  data: {
    task: Task;
  };
};

const formatDigits = (num: number | undefined) =>
  typeof num === "number" ? (num > 10 ? `${num}` : `0${num}`) : ``;

export default function SingleTaskRoute() {
  const router = useRouter();
  const { taskId } = router.query;

  const { timers, startTimer, pauseTimer, stopTimer } = useTimersStore(
    ({ timers, startTimer, pauseTimer, stopTimer }) => ({
      timers,
      startTimer,
      stopTimer,
      pauseTimer,
    }),
    shallow
  );
  if (!taskId) {
    return (
      <MainLayout>
        <p>Loading...</p>;
      </MainLayout>
    );
  }

  const timer = timers.find((t) => t.id === parseInt(taskId as string));

  console.log({ timer });

  return (
    <MainLayout>
      <div className="flex">
        <button className="ml-auto text-sky-400">Edit</button>
      </div>
      <div className="h-screen flex justify-center">
        <div
          className="flex-col justify-evenly w-1/3 h-3/4 border-2 rounded-xl p-4"
          style={{ backgroundColor: timer?.theme, borderColor: timer?.theme }}
        >
          <div className="flex h-1/3">
            <div className="flex-col">
              <p>Minutes elapsed</p>
              <div className="flex">
                <ClockIcon className="w-6 h-6" />
                <p>{timer ? timer.minutes - timer.minutesRemaining : ""}</p>
              </div>
            </div>
            <div className="flex-col ml-auto">
              <p>Minutes remaining</p>
              <div className="flex justify-end">
                <ClockIcon className="w-6 h-6" />
                <p>{timer ? timer.minutesRemaining : ""}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center items-end h-1/6">
            <h1 className="w-fit text-3xl">{timer?.title}</h1>
          </div>

          <div className="flex justify-center h-1/6">
            <div className="flex-col items-center w-fit">
              <p className="text-3xl">{timer?.minutesRemaining}</p>
              <p className="text-xs">Minute(s)</p>
            </div>
            <p className="text-3xl h-fit">:</p>
            <div className="flex-col items-stretch w-fit">
              <p className="text-3xl">{timer?.seconds}</p>
              <p className="text-xs">Second(s)</p>
            </div>
          </div>

          <div className="flex justify-center h-1/3">
            <button
              className="w-16 disabled:opacity-50"
              onClick={() => stopTimer(parseInt(taskId as string))}
              disabled={!timer?.isRunning}
            >
              <StopCircleIcon className="stroke-red-500" />
            </button>
            <button
              className="w-32 disabled:opacity-50"
              onClick={() => startTimer(parseInt(taskId as string))}
              disabled={timer?.isRunning}
            >
              <PlayCircleIcon className="stroke-sky-500" />
            </button>
            <button
              className="w-16 disabled:opacity-50"
              onClick={() => pauseTimer(parseInt(taskId as string))}
              disabled={!timer?.isRunning}
            >
              <PauseCircleIcon className="stroke-slate-500" />
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
