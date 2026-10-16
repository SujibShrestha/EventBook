import bcrypt from "bcryptjs";

import { env } from "../src/config/env.js";
import logger from "../src/config/logger.js";
import {prisma} from "../src/config/db.js";

const PASSWORD_HASH_COST = 12;

async function main() {
  if (!env.ADMIN_EMAIL || !env.ADMIN_PASSWORD) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required to seed the admin user");
  }

  if (env.ADMIN_PASSWORD.length < 8) {
    throw new Error("ADMIN_PASSWORD must be at least 8 characters");
  }

  const passwordHash = await bcrypt.hash(env.ADMIN_PASSWORD, PASSWORD_HASH_COST);

  const user = await prisma.user.upsert({
    where: { email: env.ADMIN_EMAIL },
    update: {
      name: "Admin",
      passwordHash,
      role: "ADMIN",
    },
    create: {
      name: "Admin",
      email: env.ADMIN_EMAIL,
      passwordHash,
      role: "ADMIN",
    },
    select: { id: true, email: true, role: true },
  });

  logger.info("admin seed completed", { userId: user.id, email: user.email, role: user.role });
}

try {
  await main();
} finally {
  await prisma.$disconnect();
}
