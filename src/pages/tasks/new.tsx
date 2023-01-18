import * as z from "zod";
import MainLayout from "@/components/MainLayout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const newTaskFormSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  time: z
    .number({ required_error: "Time is required" })
    .min(1, { message: "Time must be at least one minute" }),
});

type NewTaskFormSchema = z.infer<typeof newTaskFormSchema>;

export default function NewTaskRoute() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewTaskFormSchema>({
    resolver: zodResolver(newTaskFormSchema),
  });

  // TODO: transform time to number type
  console.log({ errors });

  const onSubmit = (values: NewTaskFormSchema) => {
    console.log({ values });
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("title")} />
      {errors.title?.message && (
        <p style={{ color: "red" }}>{errors.title?.message}</p>
      )}

      <input type="number" step="1" />
      {errors.time?.message && (
        <p style={{ color: "red" }}>{errors.time?.message}</p>
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
  );
}
