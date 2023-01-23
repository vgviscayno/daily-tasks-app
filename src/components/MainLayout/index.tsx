import styles from "@/components/MainLayout/styles.module.css";
import Link from "next/link";
import { useRouter } from "next/router";

type MainLayoutProps = {
  children?: React.ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <main className="flex">
      <nav className="border-r-2 w-4/12 p-4">
        <div className="flex justify-center border-solid border-2 p-4">
          <h1>Daily Tasks</h1>
          <button
            className="ml-auto text-2xl font-semibold text-sky-400"
            onClick={() => {
              const windowFeatures = "left=600,top=300,width=500,height=380";
              const handle = window.open(
                "/tasks/new",
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
        <ul>
          {/* load tasks here */}
          <li></li>
        </ul>
      </nav>
      <div className="p-4">{children}</div>
    </main>
  );
}
