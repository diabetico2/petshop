import { PrismaClient } from 'generated/prisma';

const prisma = new PrismaClient();

export async function fixOldImageUrls() {
  const baseUrl = process.env.BASE_URL || 'https://petshop-production.up.railway.app';
  
  // Atualizar pets com URLs antigas
  const petsWithOldUrls = await prisma.pet.findMany({
    where: {
      fotoUrl: {
        contains: 'localhost:3000'
      }
    }
  });

  for (const pet of petsWithOldUrls) {
    if (pet.foto_url) {
      const newUrl = pet.foto_url.replace('http://localhost:3000', baseUrl);
      await prisma.pet.update({
        where: { id: pet.id },
        data: { foto_url: newUrl }
      });
      console.log(`Atualizada URL do pet ${pet.id}: ${pet.foto_url} -> ${newUrl}`);
    }
  }

  return {
    petsUpdated: petsWithOldUrls.length
  };
}
