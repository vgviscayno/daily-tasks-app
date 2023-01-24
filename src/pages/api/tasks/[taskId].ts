import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next/types";

let prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { taskId } = req.query;
    if (!taskId) {
      return res.status(404).send({});
    }

    const id = parseInt(taskId as string);

    const task = await prisma.task.findFirst({
      where: {
        id,
      },
    });

    if (!task) {
      return res.status(404).send({});
    }

    res.status(200).send({
      data: {
        task,
      },
    });
  } else if (req.method === "PATCH") {
    const { taskId } = req.query;
    if (!taskId) {
      return res.status(404).send({});
    }

    const id = parseInt(taskId as string);

    const {
      body: {
        data: { task: taskPayload },
      },
    } = req;

    const task = await prisma.task.update({ where: { id }, data: taskPayload });

    return res.status(200).json({ data: { task } });
  } else if (req.method === "DELETE") {
    const { taskId } = req.query;
    if (!taskId) {
      return res.status(404).send({});
    }

    const id = parseInt(taskId as string);

    await prisma.task.delete({ where: { id } });

    res.status(204).send(null);
  }
}
