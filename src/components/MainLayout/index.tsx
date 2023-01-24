import useTasks from "@/hooks/useTasks";
import { ChevronRightIcon, ClockIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

type MainLayoutProps = {
  children?: React.ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  const { tasks } = useTasks();
  return (
    <main className="flex">
      <nav className="border-r-2 border-black w-3/12 h-screen p-4">
        <div className="flex">
          <button
            className="ml-auto text-2xl font-semibold text-sky-400"
            onClick={() => {
              const windowFeatures = "left=600,top=300,width=500,height=380";
              const handle = window.open(
                "/tasks/configure/new",
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
            +
          </button>
        </div>
        <h1>Daily Tasks</h1>
        <ul className="mt-4">
          {tasks.map((task) => (
            <li key={task.id}>
              <Link
                className="my-2 p-4 border-2 flex items-center"
                style={{
                  backgroundColor: task.theme,
                  borderColor: task.theme,
                }}
                href={`/tasks/${task.id}`}
              >
                <h2>{task.title}</h2>

                <div className="flex ml-auto">
                  <p>{task.minutes}</p>
                  <ClockIcon className="h-6 w-6" />
                  <ChevronRightIcon className="h-6 w-6 ml-4" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <section className="p-4 h-screen w-screen">{children}</section>
    </main>
  );
}
