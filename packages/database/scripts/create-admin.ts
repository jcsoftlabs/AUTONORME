import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const phone = '+50944440000';
  
  console.log(`🚀 Création de l'admin de test : ${phone}...`);

  const admin = await prisma.user.upsert({
    where: { phone },
    update: {
      role: Role.SUPER_ADMIN,
      name: 'Admin AUTONORME',
    },
    create: {
      phone,
      role: Role.SUPER_ADMIN,
      name: 'Admin AUTONORME',
    },
  });

  console.log('✅ Admin créé ou mis à jour avec succès !');
  console.log(admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
