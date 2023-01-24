import MainLayout from "@/components/MainLayout";
import { useTimersStore } from "@/hooks/useTimersStore";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  PauseCircleIcon,
  PlayCircleIcon,
  StopCircleIcon,
} from "@heroicons/react/24/outline";
import { Task } from "@prisma/client";
import Head from "next/head";

import { useRouter } from "next/router";
import { useCallback } from "react";
import { shallow } from "zustand/shallow";

const formatDigits = (num: number | undefined) =>
  typeof num === "number" ? (num >= 10 ? `${num}` : `0${num}`) : ``;

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

  const timer = timers.find((t) => t.id === parseInt(taskId as string));
  const timerIndex = timers.findIndex(
    (t) => t.id === parseInt(taskId as string)
  );

  const navigateTasks = useCallback(
    (direction: "backward" | "forward") => {
      if (timerIndex !== -1) {
        if (direction === "backward") {
          router.push(
            `/tasks/${
              timerIndex === 0
                ? timers[timers.length - 1].id
                : timers[timerIndex - 1].id
            }`
          );
        } else if (direction === "forward") {
          router.push(
            `/tasks/${
              timerIndex === timers.length - 1
                ? timers[0].id
                : timers[timerIndex + 1].id
            }`
          );
        }
      }
    },
    [timers, router, timerIndex]
  );

  if (!taskId) {
    return (
      <MainLayout>
        <p>Loading...</p>;
      </MainLayout>
    );
  }

  if (!timer) {
    router.push("/");
  }

  return (
    <>
      <Head>
        <title>
          {timer?.minutesRemaining}:{formatDigits(timer?.seconds)} -{" "}
          {timer?.title}
        </title>
      </Head>
      <MainLayout>
        <div className="flex">
          <button
            className="ml-auto text-sky-400"
            // onClick={() => router.push(`/tasks/configure/${timer?.id}`)}
            onClick={() => {
              if (!timer) {
                return alert("Timer not found");
              }
              const windowFeatures = "left=600,top=300,width=500,height=380";
              const handle = window.open(
                `/tasks/configure/${timer.id}`,
                "newTaskWindow",
                windowFeatures
              );
              if (!handle) {
                alert(
                  "The window wasn't allowed to open. This is likely caused by built-in popup blockers."
                );
              }
            }}
          >
            Edit
          </button>
        </div>
        <div className="h-full flex justify-between items-center">
          <button
            className="h-fit"
            onClick={() => {
              navigateTasks("backward");
            }}
          >
            <ChevronLeftIcon className="h-12 w-12 ml-4" />
          </button>
          <div
            className="flex-col justify-evenly w-1/3 h-3/4 border-2 rounded-xl p-4"
            style={{ backgroundColor: timer?.theme, borderColor: timer?.theme }}
          >
            <div className="flex h-1/3">
              <div className="flex-col">
                <p>Minutes elapsed</p>
                <div className="flex">
                  <ClockIcon className="w-6 h-6" />
                  <p>{timer ? timer.minutesElapsed : ""}</p>
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
                <p className="text-3xl">
                  {formatDigits(timer?.minutesRemaining)}
                </p>
                <p className="text-xs">Minute(s)</p>
              </div>
              <p className="text-3xl h-fit">:</p>
              <div className="flex-col items-stretch w-fit">
                <p className="text-3xl">{formatDigits(timer?.seconds)}</p>
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
          <button
            className="h-fit"
            onClick={() => {
              navigateTasks("forward");
            }}
          >
            <ChevronRightIcon className="h-12 w-12 ml-4" />
          </button>
        </div>
      </MainLayout>
    </>
  );
}
