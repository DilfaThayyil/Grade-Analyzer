import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { parse } from 'papaparse';

const prisma = new PrismaClient();

export async function POST(req: Request) {
    const session = await auth();
    console.log("user in upload : ",session?.user)
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as Blob;
    if (!file) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const text = await file.text();

    return new Promise<NextResponse>((resolve, reject) => {
        parse(text, {
            header: true,
            skipEmptyLines: true,
            complete: async results => {
                const rows = results.data as Record<string, string>[];
                try {
                    let user = await prisma.user.findUnique({
                        where: { email: session.user?.email },
                    });
                    if (!user) {
                        user = await prisma.user.create({
                            data: { email: session.user?.email, name: session.user?.name || '' },
                        });
                    }

                    const upload = await prisma.upload.create({
                        data: {
                            name: (file as any).name || `upload-${Date.now()}`,
                            userId: user.id,
                            students: {
                                create: rows.map((row) => ({
                                    userId: user.id,
                                    name: row.Name ?? row.name ?? '',
                                    email: row.Email ?? row.email ?? '',
                                    subject: row.Subject ?? row.subject ?? '',
                                    marks: parseInt(row.Marks ?? row.marks ?? '0', 10),
                                    examDate: row['Exam Date']
                                        ? new Date(row['Exam Date'])
                                        : row.examDate
                                            ? new Date(row.examDate)
                                            : new Date(),
                                })),
                            },
                        },
                        include: { students: true },
                    });

                    resolve(
                        NextResponse.json(
                            {
                                success: true,
                                uploadId: upload.id,
                                students: upload.students,
                            },
                            { status: 200 }
                        )
                    );
                } catch (e) {
                    console.error(e);
                    reject(NextResponse.json({ error: 'Failed to save data' }, { status: 500 }));
                }
            },
            error: (err: unknown) => {
                console.error('CSV parse error:', err);
                reject(NextResponse.json({ error: 'Invalid CSV format' }, { status: 400 }));
            },
        });
    });
}
