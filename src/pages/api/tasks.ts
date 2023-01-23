import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next/types";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // create task
    if (req.method === "POST") {
      const {
        body: {
          data: { task: taskPayload },
        },
      } = req;

      const task = await prisma.task.create({ data: taskPayload });

      return res.status(201).json({ data: { task } });
    }
    // get tasks
    else if (req.method === "GET") {
      const tasks = await prisma.task.findMany();
      return res.status(200).json({ data: { tasks } });
    }
  } catch (error: unknown) {
    console.error(error);
    res.status(400).json({ error });
  }
}
