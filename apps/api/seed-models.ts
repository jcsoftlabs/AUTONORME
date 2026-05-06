import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding featured models with generations...');

  const models = [
    {
      title: '4RUNNER 2010-2024',
      years: '2010-2024',
      filterMake: 'TOYOTA',
      filterModel: '4RUNNER',
      imageUrl: 'https://images.unsplash.com/photo-1626233519828-5692019910d6?auto=format&fit=crop&q=80&w=400',
      order: 1
    },
    {
      title: 'HILUX 2015-2025',
      years: '2015-2025',
      filterMake: 'TOYOTA',
      filterModel: 'HILUX',
      imageUrl: 'https://images.unsplash.com/photo-1622321453264-f67455a02484?auto=format&fit=crop&q=80&w=400',
      order: 2
    },
    {
      title: 'PATROL 2010-2024',
      years: '2010-2024',
      filterMake: 'NISSAN',
      filterModel: 'PATROL',
      imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=400',
      order: 3
    },
    {
      title: 'GRAND VITARA 05-24',
      years: '2005-2024',
      filterMake: 'SUZUKI',
      filterModel: 'GRAND VITARA',
      imageUrl: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=400',
      order: 4
    }
  ];

  for (const model of models) {
    await prisma.featuredModel.upsert({
      where: { title: model.title },
      update: model,
      create: model,
    });
  }

  console.log('✅ Seed completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
