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
    const [totalUsers, totalAdmins, newUsersThisMonth, totalCourses] = await Promise.all([
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
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const usersLast7Days = await prisma.user.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: { gte: sevenDaysAgo }
      },
      _count: {
        id: true
      },
    });

    // Format dữ liệu cho Recharts (Nhóm theo ngày: "DD/MM")
    // Lưu ý: Prisma trả về DateTime chi tiết, ta cần gom nhóm lại bằng JS
    // (Cách đơn giản nhất ở đây là lấy user về rồi map, với dữ liệu lớn thì nên dùng raw query SQL)
    const usersRaw = await prisma.user.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      select: { createdAt: true }
    });

    // Map: { "05/12": 2, "06/12": 5 ... }
    const chartDataMap: Record<string, number> = {};
    usersRaw.forEach(u => {
      const date = new Date(u.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
      chartDataMap[date] = (chartDataMap[date] || 0) + 1;
    });

    // Chuyển về mảng object cho Recharts: [{ name: "05/12", value: 2 }, ...]
    const userGrowthChart = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i); // Lùi lại i ngày
      
      const key = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
      
      userGrowthChart.push({
        name: key,
        value: chartDataMap[key] || 0 // Nếu ngày đó không có ai thì điền 0
      });
    }
    // 3. Trả về kết quả
    return NextResponse.json({
      totalUsers,
      totalAdmins,
      newUsersThisMonth,
      totalCourses,// Cái này fake vì chưa có bảng Order
      userGrowthChart 
    });

  } catch (error) {
    return NextResponse.json({ message: 'Lỗi Server' }, { status: 500 });
  }
}