import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Head from "next/head";
import { ClockIcon, Squares2X2Icon } from "@heroicons/react/24/outline";
import uniqolor from "uniqolor";
import { useEffect } from "react";

const newTaskFormSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  minutes: z
    .number({ required_error: "Time is required" })
    .min(1, { message: "Time must be at least one minute" }),
  theme: z.string().min(1, { message: "Theme is required" }),
});

type NewTaskFormSchema = z.infer<typeof newTaskFormSchema>;

const defaultValues: NewTaskFormSchema = {
  title: "",
  minutes: 1,
  theme: uniqolor.random({ format: "hex", lightness: [70, 80] }).color,
};

export default function NewTaskRoute() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful, isSubmitting },
    reset,
  } = useForm<NewTaskFormSchema>({
    resolver: zodResolver(newTaskFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  const onSubmit = (values: NewTaskFormSchema) => {
    console.log({ values });
    fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: { task: values } }),
    });
  };

  return (
    <div>
      <Head>
        <title>Configure Task</title>
      </Head>
      <div className="grid h-screen place-items-center">
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
