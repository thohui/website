import type { ContactLink } from "@/lib/profile";
import type { Project } from "@/lib/projects";

export interface TerminalData {
	about: string[];
	skills: string[];
	projects: Project[];
	contact: ContactLink[];
}

export interface Segment {
	text: string;
	className?: string;
	background?: string;
}

export interface PrintOptions {
	className?: string;
	prefix?: string;
}

export interface CommandContext {
	args: string[];
	data: TerminalData;
	commands: CommandMap;
	history: string[];
	print(text?: string, options?: PrintOptions): void;
	printLink(href: string, label: string, options?: PrintOptions): void;
	printRows(rows: [string, string][], options?: PrintOptions): void;
	printSegments(segments: Segment[], options?: PrintOptions): void;
	clear(): void;
	close(): void;
}

export interface Command {
	description: string;
	usage?: string;
	hidden?: boolean;
	run(ctx: CommandContext): void | Promise<void>;
}

export type CommandMap = Record<string, Command>;
