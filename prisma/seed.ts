import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.DEFAULT_ADMIN_EMAIL ?? 'admin@saogiay.local';
  const password = process.env.DEFAULT_ADMIN_PASSWORD ?? '12345678';
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      fullName: 'System Admin',
      role: UserRole.ADMIN,
      isActive: true,
    },
    create: {
      email,
      passwordHash,
      fullName: 'System Admin',
      role: UserRole.ADMIN,
      isActive: true,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
