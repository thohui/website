export interface Project {
	title: string;
	description: string;
	githubUrl: string;
	technologies: string[];
}


export const PROJECTS: Project[] = [
	{
		title: "ResoDNS",
		description: "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
		githubUrl: "https://github.com/thohui/reso-dns",
		technologies: ["Rust", "Typescript", "React"],
	},
	{
		title: "Reacticulum",
		description: "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
		githubUrl: "https://github.com/reacticulum/reacticulum",
		technologies: ["Typescript", "React"],
	}
];