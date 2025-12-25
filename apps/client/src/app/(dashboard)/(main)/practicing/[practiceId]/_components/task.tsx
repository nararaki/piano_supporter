import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { Task } from "@piano_supporter/common/domains/task.ts";

export default function TaskComponent({ task }: { task: Task }) {
	return (
		<Card>
            <CardHeader>
                <CardTitle>{task.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p>{task.annotation.content}</p>
            </CardContent>
            <CardFooter>
                <p>{task.status.name}</p>
            </CardFooter>
        </Card>
	);
}