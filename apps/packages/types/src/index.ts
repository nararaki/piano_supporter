export type school = {
    id: string;
    name: string;
    email: string | null;
    location: string;
    shareCode: schoolCodeDto;
}

export type schoolCodeDto = {
    schoolCode: string;
}

export type AccountRole = 'teacher' | 'student' | 'admin';
