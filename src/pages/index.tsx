import Head from "next/head";
import MainLayout from "@/components/MainLayout";

export default function Home() {
  return (
    <>
      <Head>
        <title>Daily Tasks App</title>
        <meta name="description" content="App for managing timed tasks" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainLayout>
        <div>
          <h1>
            Welcome to Daily Tasks! <br /> Choose a task to do, or add one to
            get started.
          </h1>
        </div>
      </MainLayout>
    </>
  );
}
