import { verifyAdmin } from '@/app/lib/auth-check';
import { prisma } from '@/app/lib/prisma';
import { NextResponse } from 'next/server';


// 1. Sửa type của params thành Promise
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    // 2. Phải AWAIT params trước khi lấy ID
    const { id } = await params; 

    // console.log("Đang xóa user ID:", id); // Bật log này lên để debug

    // 3. Check quyền Admin
    const admin = await verifyAdmin();
    if (!admin) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

    // 4. Không cho phép tự xóa chính mình
    if (id === admin.userId) {
      return NextResponse.json({ message: 'Không thể tự xóa chính mình!' }, { status: 400 });
    }

    // 5. Xóa user trong DB
    await prisma.user.delete({
      where: { id }, // id ở đây là string lấy từ params
    });

    return NextResponse.json({ message: 'Xóa thành công' });

  } catch (error: any) {
    // IN LỖI CHI TIẾT RA TERMINAL ĐỂ SOI
    console.error("Lỗi xóa user:", error); 
    
    // Kiểm tra xem có phải lỗi do dính khóa ngoại (Foreign Key) không
    if (error.code === 'P2003') {
      return NextResponse.json({ message: 'User này đang có dữ liệu liên quan, không thể xóa!' }, { status: 400 });
    }

    
    return NextResponse.json({ message: 'Lỗi khi xóa user: ' + error.message }, { status: 500 });
  }
}