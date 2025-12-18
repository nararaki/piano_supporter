export interface Task {
    id: string;
    title: string;
    description: string;
    content: string;
    status: string;
    practiceId: string;
    createdAt: Date;
    updatedAt: Date;
}