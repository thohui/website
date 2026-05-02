export interface Project {
	title: string;
	description: string;
	url: string;
	technologies: string[];
}


export const ONGOING_PROJECTS: Project[] = [
	{
		title: "ResoDNS",
		description: "Self hostable DNS server with a focus on security and privacy.",
		url: "https://github.com/thohui/reso-dns",
		technologies: ["Rust", "Typescript", "React", "SQLite", "Docker"],
	},
];
