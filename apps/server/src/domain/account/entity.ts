export type AccountRole = 'teacher' | 'student' | 'admin';

export type Account = {
    id: string;
    clerkUserId: string;
    organizationId: string;
    firstName: string;
    lastName: string;
    email: string;
    profileImage: string | null;
    createdAt: Date;
    updatedAt: Date;
}