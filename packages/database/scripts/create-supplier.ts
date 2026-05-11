import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const phone = '+50933330000';
  
  console.log(`🚀 Création du compte fournisseur de test : ${phone}...`);

  const supplier = await prisma.user.upsert({
    where: { phone },
    update: {
      role: Role.SUPPLIER,
      name: 'Haïti AutoParts Center',
    },
    create: {
      phone,
      role: Role.SUPPLIER,
      name: 'Haïti AutoParts Center',
    },
  });

  console.log('✅ Fournisseur créé ou mis à jour avec succès !');
  console.log(supplier);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
