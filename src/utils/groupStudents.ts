type FlatStudent = {
    id: string;
    name: string;
    email: string;
    subject: string;
    marks: number;
    examDate: string | Date;
};

type GroupedStudent = {
    id: string;
    name: string;
    email: string;
    subjects: {
        subject: string;
        marks: number;
        examDate: Date;
    }[];
};

export function groupStudents(flatStudents: FlatStudent[]): GroupedStudent[] {
    const grouped = new Map<string, GroupedStudent>();

    for (const s of flatStudents) {
        const key = s.email;

        if (!grouped.has(key)) {
            grouped.set(key, {
                id: s.id,
                name: s.name,
                email: s.email,
                subjects: [],
            });
        }

        grouped.get(key)!.subjects.push({
            subject: s.subject,
            marks: s.marks,
            examDate: new Date(s.examDate),
        });
    }

    return Array.from(grouped.values());
}
