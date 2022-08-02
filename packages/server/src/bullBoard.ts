import { createBullBoard } from "@bull-board/api";
import { BullAdapter } from "@bull-board/api/bullAdapter";
import { ExpressAdapter } from "@bull-board/express";
import { Queue } from "bull";
import * as expressBasicAuth from "express-basic-auth";

const PATH = '/admin/bull'

export const bullBoard = (queue: Queue) => {
  const serverAdapter = new ExpressAdapter();
  serverAdapter.setBasePath(PATH);
  createBullBoard({
    queues: [new BullAdapter(queue)],
    serverAdapter,
  });
  return [
    PATH,
    expressBasicAuth({
      users: {
        admin: process.env.ADMIN_PASSWORD,
      },
      challenge: true,
    }),
    serverAdapter.getRouter(),
  ]
}