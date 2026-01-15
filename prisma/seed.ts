import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const ownerEmail = "owner@beachclub.local";
  const ownerPass = "ChangeMeNow!";

  const passwordHash = await bcrypt.hash(ownerPass, 12);

  await prisma.user.upsert({
    where: { email: ownerEmail },
    update: {},
    create: {
      email: ownerEmail,
      name: "Owner",
      role: "OWNER",
      passwordHash
    }
  });

  const categories = ["Bar", "VIP", "Event", "Stock", "Salaires", "Fournisseurs", "Divers"];
  for (const name of categories) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name }
    });
  }

  console.log("Seed OK");
  console.log("Owner:", ownerEmail);
  console.log("Password:", ownerPass);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
