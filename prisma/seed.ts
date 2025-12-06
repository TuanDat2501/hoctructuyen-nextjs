import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Tạo các danh mục mặc định
  const categories = ['Văn hoá', 'Kỹ năng chuyên môn'];

  for (const name of categories) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log('Đã thêm danh mục mẫu!');
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); })