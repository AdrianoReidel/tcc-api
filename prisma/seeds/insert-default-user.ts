import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const userId = 'c6d4f7a3-2e6c-4a1f-bb2e-7f6d1c9e9b4d';

  const hashedPassword = await bcrypt.hash('123', 8);

  await prisma.$executeRawUnsafe(`
    INSERT INTO app_user (id, email, password, name, role, created_at, updated_at, , status)
      VALUES ('${userId}', 'adrianojosereidel@hotmail.com', '${hashedPassword}', 'admin', '[ADMIN]', NOW(), NOW(), 'ACTIVE')
    ON CONFLICT (id) DO NOTHING;
  `);

  console.log('Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('Erro ao rodar o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
