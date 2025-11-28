import { verifyAdmin } from '@/app/lib/auth-check';
import { prisma } from '@/app/lib/prisma';
import { NextResponse } from 'next/server';


export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await prisma.section.update({
      where: { id },
      data: { title: body.title }
    });
    return NextResponse.json(updated);
  } catch (error) { return NextResponse.json({ message: 'Lỗi' }, { status: 500 }); }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

  try {
    const { id } = await params;
    await prisma.section.delete({ where: { id } });
    return NextResponse.json({ message: 'Xóa thành công' });
  } catch (error) { return NextResponse.json({ message: 'Lỗi' }, { status: 500 }); }
}