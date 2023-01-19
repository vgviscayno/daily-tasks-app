import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Head from "next/head";

const newTaskFormSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  time: z
    .number({ required_error: "Time is required" })
    .min(1, { message: "Time must be at least one minute" }),
  theme: z.string().min(1, { message: "Theme is required" }),
});

type NewTaskFormSchema = z.infer<typeof newTaskFormSchema>;

const defaultValues: NewTaskFormSchema = {
  title: "",
  time: 1,
  theme: Math.floor(Math.random() * 16777215).toString(16),
};

export default function NewTaskRoute() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewTaskFormSchema>({
    resolver: zodResolver(newTaskFormSchema),
    defaultValues,
  });

  const onSubmit = (values: NewTaskFormSchema) => {
    console.log({ values });
  };
  return (
    <>
      <Head>
        <title>Configure Task</title>
      </Head>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <label htmlFor="title" style={{ textTransform: "capitalize" }}>
            title:
          </label>
          <input {...register("title")} />
        </div>
        {errors.title?.message && (
          <p style={{ color: "red" }}>{errors.title?.message}</p>
        )}

        <div style={{ display: "flex", alignItems: "center" }}>
          <label htmlFor="time" style={{ textTransform: "capitalize" }}>
            time:
          </label>
          <input
            type="number"
            step="1"
            {...register("time", {
              setValueAs: (v) => (v === "" ? undefined : parseInt(v, 10)),
            })}
          />
        </div>
        {errors.time?.message && (
          <p style={{ color: "red" }}>{errors.time?.message}</p>
        )}

        <div style={{ display: "flex", alignItems: "center" }}>
          <label htmlFor="theme" style={{ textTransform: "capitalize" }}>
            theme:
          </label>
          <input type="color" {...register("theme")} />
        </div>

        {errors.theme?.message && (
          <p style={{ color: "red" }}>{errors.theme?.message}</p>
        )}

        <button
          type="button"
          onClick={() => {
            if (confirm("Are you sure you want to close this window?")) {
              window.close();
            }
          }}
        >
          Cancel
        </button>
        <button type="submit">Save</button>
      </form>
    </>
  );
}
