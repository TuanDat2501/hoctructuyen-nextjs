import { verifyAdmin } from '@/app/lib/auth-check';
import { prisma } from '@/app/lib/prisma';
import { NextResponse } from 'next/server';


export async function GET() {
  // 1. Bảo mật: Check quyền Admin
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    // 2. Query Database song song (cho nhanh)
    const [totalUsers, totalAdmins, newUsersThisMonth,totalCourses] = await Promise.all([
      // Đếm tổng user
      prisma.user.count(),
      
      // Đếm tổng admin
      prisma.user.count({ where: { role: 'admin' } }),

      // Đếm user mới trong tháng này
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
      prisma.course.count(),
    ]);

    // 3. Trả về kết quả
    return NextResponse.json({
      totalUsers,
      totalAdmins,
      newUsersThisMonth,
      totalCourses, // Cái này fake vì chưa có bảng Order
    });

  } catch (error) {
    return NextResponse.json({ message: 'Lỗi Server' }, { status: 500 });
  }
}