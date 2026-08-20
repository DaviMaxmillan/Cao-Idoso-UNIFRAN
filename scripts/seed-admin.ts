import "dotenv/config";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

const username = process.argv[2];
const password = process.argv[3];

if (!username || !password) {
  console.error(
    "Uso: npx tsx scripts/seed-admin.ts <usuario> <senha>"
  );
  process.exit(1);
}

async function main() {
  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await db.adminUser.upsert({
    where: { username },
    update: { passwordHash },
    create: { username, passwordHash },
  });

  console.log(`Admin "${admin.username}" pronto (id: ${admin.id}).`);
  await db.$disconnect();
}

main();
