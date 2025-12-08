import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";

interface PageHeaderProps {
	title: string;
	action?: {
		label: string;
		onClick: () => void;
		icon?: LucideIcon;
		variant?: "default" | "outline" | "ghost" | "secondary" | "destructive" | "link";
	};
	children?: ReactNode;
}

export function PageHeader({ title, action, children }: PageHeaderProps) {
	return (
		<div className="flex items-center justify-between mb-6">
			<h1 className="text-2xl font-bold">{title}</h1>
			<div className="flex items-center gap-3">
				{children}
				{action && (
					<Button onClick={action.onClick} variant={action.variant || "default"}>
						{action.icon && <action.icon className="h-4 w-4 mr-2" />}
						{action.label}
					</Button>
				)}
			</div>
		</div>
	);
}

