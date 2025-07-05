import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
    const session = await auth();

    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    };

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q')?.toLowerCase() || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '5', 10);
    const skip = (page - 1) * limit;

    try {
        const allStudents = await prisma.student.findMany({
            where: {
                userId: session.user.id,
                OR: [
                    { name: { contains: query , mode: 'insensitive' } },
                    { email: { contains: query , mode: 'insensitive' } },
                ],
            },
            orderBy: { examDate: 'desc' },
        });

        const groupedMap = new Map();

        for (const student of allStudents) {
            const key = `${student.name}-${student.email}`;
            if (!groupedMap.has(key)) {
                groupedMap.set(key, {
                    id: student.id,
                    name: student.name,
                    email: student.email,
                    subjects: [],
                });
            }
            if (!student.subject || typeof student.marks !== 'number') {
                console.warn(`Incomplete student entry:`, student);
            }
            if(student.subject && typeof student.marks === 'number'){
                groupedMap.get(key).subjects.push({
                    subject: student.subject,
                    marks: student.marks,
                    examDate: student.examDate,
                });
            }            
        }

        const groupedStudents = Array.from(groupedMap.values());
        const total = groupedStudents.length;

        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '5', 10);
        const startIndex = (page - 1) * limit;
        const paginatedStudents = groupedStudents.slice(startIndex, startIndex + limit);

        return NextResponse.json({ students: paginatedStudents, total }, { status: 200 });

    } catch (error) {
        console.error('Error fetching students:', error instanceof Error ? error.message : error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
