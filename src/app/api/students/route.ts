import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
    const session = await auth();
    console.log("userrrrrrr:", session?.user);

    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q')?.toLowerCase() || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '5', 10);
    const skip = (page - 1) * limit;

    try {
        const [students, total] = await Promise.all([
            prisma.student.findMany({
                where: {
                    userId: session.user.id,
                    OR: [
                        { name: { contains: query} },
                        { subject: { contains: query} },
                        { email: { contains: query} },
                    ],
                },
                orderBy: { examDate: 'desc' },
                skip,
                take: limit,
            }),
            prisma.student.count({
                where: {
                    userId: session.user.id,
                    OR: [
                        { name: { contains: query} },
                        { subject: { contains: query} },
                        { email: { contains: query} },
                    ],
                },
            }),
        ]);

        return NextResponse.json({ students, total }, { status: 200 });
    } catch (error) {
        console.error('Error fetching students:', error instanceof Error ? error.message : error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
