import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next/types";

let prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
}
