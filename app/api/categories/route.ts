import { prisma } from '@/app/lib/prisma';
import { NextResponse } from 'next/server';


export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ message: 'Lỗi lấy danh mục' }, { status: 500 });
  }
}