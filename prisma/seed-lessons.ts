import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // 1. Lấy khóa học đầu tiên tìm được
  const course = await prisma.course.findFirst();
  if (!course) {
    console.log("Chưa có khóa học nào. Hãy tạo khóa học trước!");
    return;
  }

  console.log(`Đang thêm bài học cho khóa: ${course.title}`);

  // 2. Tạo Chương 1
  const s1 = await prisma.section.create({
    data: {
      title: "Chương 1: Giới thiệu tổng quan",
      courseId: course.id,
      lessons: {
        create: [
          { title: "Lời chào mừng & Hướng dẫn học", duration: "02:15", videoId: "jfKfPfyJRdk" }, // Lofi girl demo
          { title: "Cài đặt môi trường cần thiết", duration: "05:30", videoId: "5qap5aO4i9A" },
        ]
      }
    }
  });

  // 3. Tạo Chương 2
  const s2 = await prisma.section.create({
    data: {
      title: "Chương 2: Kiến thức nền tảng",
      courseId: course.id,
      lessons: {
        create: [
          { title: "Tư duy lập trình hiệu quả", duration: "10:00", videoId: "M5QY2_8704o" },
          { title: "Cấu trúc dự án thực tế", duration: "08:45", videoId: "SqcY0GlETPk" },
          { title: "Tổng kết chương", duration: "03:10", videoId: "9bZkp7q19f0" },
        ]
      }
    }
  });

  console.log("Xong! Đã thêm 2 chương và 5 bài học.");
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); })