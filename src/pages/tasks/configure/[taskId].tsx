import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Head from "next/head";
import {
  ClockIcon,
  Squares2X2Icon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import uniqolor from "uniqolor";
import { useEffect } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import { Task } from "@prisma/client";

const configureTaskFormSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  minutes: z
    .number({ required_error: "Time is required" })
    .min(1, { message: "Time must be at least one minute" }),
  theme: z.string().min(1, { message: "Theme is required" }),
});

type ConfigureTaskFormSchema = z.infer<typeof configureTaskFormSchema>;

const defaultValues: ConfigureTaskFormSchema = {
  title: "",
  minutes: 1,
  theme: uniqolor.random({ format: "hex", lightness: [70, 80] }).color,
};

export default function ConfigureTaskRoute() {
  const router = useRouter();
  const { taskId = "" } = router.query;

  const id = taskId === "new" ? undefined : taskId;

  const { data: task, mutate } = useSWR<Task>(id, async (id) => {
    const response = await fetch(`/api/tasks/${id}`);
    const body = (await response.json()) as { data: { task: Task } };
    return body.data.task;
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful, isSubmitting },
    reset,
  } = useForm<ConfigureTaskFormSchema>({
    resolver: zodResolver(configureTaskFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (task) {
      reset({
        minutes: task.minutes,
        theme: task.theme,
        title: task.title,
      });
    }
  }, [task, reset]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      if (task) {
        reset({
          minutes: task.minutes,
          theme: task.theme,
          title: task.title,
        });
      } else {
        reset();
      }
    }
  }, [isSubmitSuccessful, reset, task]);

  const onSubmit = (values: ConfigureTaskFormSchema) => {
    if (!id) {
      fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: { task: values } }),
      });
    } else {
      fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: { task: values } }),
      })
        .then((response) => response.json())
        .then((body: { data: { task: Task } }) => {
          mutate(body.data.task);
        });
    }
  };

  return (
    <div>
      <Head>
        <title>Configure Task</title>
      </Head>
      {id && (
        <div className="flex justify-end">
          <button
            onClick={() => {
              if (confirm("Are you sure you want to delete this task?")) {
                fetch(`/api/tasks/${id}`, {
                  method: "DELETE",
                  headers: {
                    "Content-Type": "application/json",
                  },
                }).then((response) => {
                  if (response.status === 204) {
                    alert("Task has been deleted. This window will now close.");
                    window.close();
                  }
                });
              }
            }}
          >
            <TrashIcon className="h-6 w-6 stroke-red-600" />
          </button>
        </div>
      )}
      <div className="grid h-full place-items-center">
        <form
          method="post"
          onSubmit={handleSubmit(onSubmit)}
          className="flex-col justify-center space-y-4 m-2 p-4"
        >
          <div className="flex-col">
            <input
              {...register("title")}
              className="w-full p-2 border-2 border-black"
              placeholder="Write the task title..."
            />
            {errors.title?.message && (
              <p className="text-red-600 w-full">{errors.title?.message}</p>
            )}
          </div>

          <div className="flex-col">
            <div className="flex p-2 align-center border-2 border-black">
              <ClockIcon className="h-6 w-6 mr-2" />
              <label htmlFor="minutes" className="w-3/4 text-slate-700 ">
                Length
              </label>
              <input
                className="w-1/5 ml-auto "
                type="number"
                step="1"
                min="1"
                {...register("minutes", {
                  setValueAs: (v) => (v === "" ? undefined : parseInt(v, 10)),
                })}
              />
              <span>minutes</span>
            </div>
            {errors.minutes?.message && (
              <p className="text-red-600 w-full">{errors.minutes?.message}</p>
            )}
          </div>

          <div className="flex-col">
            <div className="flex p-2 border-2 border-black">
              <Squares2X2Icon className="h-6 w-6 mr-2" />
              <label htmlFor="theme" className="w-3/4 text-slate-700">
                Theme
              </label>
              <input
                type="color"
                {...register("theme")}
                className="w-1/4 ml-auto"
              />
            </div>
            {errors.theme?.message && (
              <p className="text-red-600 w-full">{errors.theme?.message}</p>
            )}
          </div>

          <div className="flex">
            <button
              className="w-1/2 p-2"
              type="button"
              onClick={() => {
                if (confirm("Are you sure you want to close this window?")) {
                  window.close();
                }
              }}
            >
              Cancel
            </button>
            <button
              className="w-1/2 bg-sky-500 border-2 border-black p-2 text-white"
              type="submit"
              disabled={isSubmitting}
            >
              Save
            </button>
          </div>
          {isSubmitting && <p>Creating task...</p>}
        </form>
      </div>
    </div>
  );
}
