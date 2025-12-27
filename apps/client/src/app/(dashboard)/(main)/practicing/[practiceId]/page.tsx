"use client";
import { useParams } from "next/navigation";
import TasksViewer from "./_components/taskviewer";
import { showError } from "@/components/ui/toast";
import { z } from "zod";

export default function practiceDetailPage() {
    const params = useParams();
    const result = z.object({ practiceId: z.string().min(1) }).safeParse(params);

    if (!result.success) {
        showError("Practice ID is required");
        return <div>Practice ID is required</div>;
    }

	return (
		<TasksViewer practiceId={result.data.practiceId} />
	);
}
