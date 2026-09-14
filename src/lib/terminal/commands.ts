import { setTheme, type Theme } from "@/lib/theme";
import type { CommandMap, Segment } from "./types";

// reso-dns logo :)
const LOGO = [
	"      ▄",
	"   ▄█████▄",
	"  █████▀▀  ██▄▄",
	"  ████     █████",
	"  ████     █████",
	"  ███▀     ████▀",
	"  ▀▀   ██▄▄▀▀",
	"       █████▄▄",
	"       ▀▀████▀▀",
];

const PALETTE = [
	["#3b4048", "#c17b6b", "#7cc47c", "#d0b46a", "#6f9bd1", "#a98bc7", "#6fb8c0", "#b8bcc2"],
	["#5c6370", "#e08a76", "#9bd99b", "#e6cd85", "#8ab4e8", "#c3a6e0", "#8fd2da", "#dcdfe4"],
];

function uptime(): string {
	const total = Math.floor(performance.now() / 1000);
	const hours = Math.floor(total / 3600);
	const mins = Math.floor((total % 3600) / 60);

	const parts: string[] = [];
	if (hours) parts.push(`${hours} hour${hours === 1 ? "" : "s"}`);
	if (mins) parts.push(`${mins} min${mins === 1 ? "" : "s"}`);
	if (parts.length === 0) parts.push(`${total} sec${total === 1 ? "" : "s"}`);

	return parts.join(", ");
}

function currentTheme(): Theme {
	return document.documentElement.getAttribute("data-theme") === "light"
		? "light"
		: "dark";
}

export const COMMANDS: CommandMap = {
	help: {
		description: "list every command",
		run(ctx) {
			ctx.print();
			ctx.printRows(
				Object.entries(ctx.commands)
					.filter(([, command]) => !command.hidden)
					.map(([name, command]) => [
						command.usage ?? name,
						command.description,
					]),
			);
			ctx.print();
		},
	},

	about: {
		description: "who you are talking to",
		run(ctx) {
			ctx.print();
			for (const paragraph of ctx.data.about) {
				ctx.print(paragraph);
				ctx.print();
			}
		},
	},

	whoami: {
		description: "guess",
		run(ctx) {
			ctx.print("visitor", { className: "t-bright" });
			ctx.print("but you already knew that.", { className: "t-dim" });
		},
	},

	projects: {
		description: "ongoing projects",
		run(ctx) {
			ctx.print();
			for (const project of ctx.data.projects) {
				ctx.printLink(project.url, project.title, {
					className: "t-bright",
					prefix: "  - ",
				});
				ctx.print(`    ${project.description}`);
				ctx.print(`    [${project.technologies.join(", ")}]`, {
					className: "t-dim",
				});
				ctx.print();
			}
			ctx.printLink("https://github.com/thohui", "github.com/thohui", {
				className: "t-dim",
				prefix: "more at ",
			});
			ctx.print();
		},
	},

	skills: {
		description: "things I work with",
		run(ctx) {
			ctx.print();
			for (const skill of ctx.data.skills) {
				ctx.print(skill, { prefix: "  - " });
			}
			ctx.print();
		},
	},

	contact: {
		description: "how to reach me",
		run(ctx) {
			ctx.print();
			const width = Math.max(...ctx.data.contact.map((c) => c.label.length));
			for (const link of ctx.data.contact) {
				ctx.printLink(link.href, link.value, {
					prefix: `  ${`${link.label}:`.padEnd(width + 2, " ")}`,
				});
			}
			ctx.print();
		},
	},

	theme: {
		description: "switch the site theme",
		usage: "theme [dark|light]",
		run(ctx) {
			const [requested] = ctx.args;
			const next: Theme =
				requested === "dark" || requested === "light"
					? requested
					: currentTheme() === "dark"
						? "light"
						: "dark";

			if (requested && requested !== "dark" && requested !== "light") {
				ctx.print(`theme: "${requested}" is not a theme`, {
					className: "t-error",
				});
				return;
			}

			setTheme(next);
			ctx.print(`theme: ${next}`, { className: "t-accent" });
		},
	},

	neofetch: {
		description: "system info, obviously",
		run(ctx) {
			const user = "visitor@thohui";
			const rows: [string, string][] = [
				["OS", "Astro (static)"],
				["Host", "thohui.com"],
				["Shell", "thosh 1.0"],
				["Uptime", uptime()],
				["Terminal", "thosh"],
				["Display", `${screen.width}x${screen.height} @ ${devicePixelRatio}x`],
				["Viewport", `${window.innerWidth}x${window.innerHeight}`],
				["Theme", currentTheme()],
				["Font", "IBM Plex Mono"],
				["Projects", String(ctx.data.projects.length)],
				["Locale", navigator.language],
			];

			const info: Segment[][] = [
				[{ text: user, className: "t-accent t-bold" }],
				[{ text: "-".repeat(user.length), className: "t-dim" }],
				...rows.map(([key, value]): Segment[] => [
					{ text: `${key}: `, className: "t-accent t-bold" },
					{ text: value },
				]),
				[],
				...PALETTE.map((row): Segment[] =>
					row.map((background) => ({ text: "   ", background })),
				),
			];

			const width = Math.max(...LOGO.map((line) => line.length)) + 2;

			ctx.print();
			for (let i = 0; i < Math.max(LOGO.length, info.length); i++) {
				ctx.printSegments(
					[
						{ text: (LOGO[i] ?? "").padEnd(width, " "), className: "t-reso" },
						...(info[i] ?? []),
					],
					{ className: "t-fetch" },
				);
			}
			ctx.print();
		},
	},

	fastfetch: {
		description: "same as neofetch",
		hidden: true,
		run(ctx) {
			COMMANDS.neofetch?.run(ctx);
		},
	},

	echo: {
		description: "say something back",
		usage: "echo <text>",
		run(ctx) {
			ctx.print(ctx.args.join(" "));
		},
	},

	date: {
		description: "current date and time",
		run(ctx) {
			ctx.print(new Date().toString());
		},
	},

	history: {
		description: "commands you have run",
		run(ctx) {
			if (ctx.history.length === 0) {
				ctx.print("nothing yet.", { className: "t-dim" });
				return;
			}
			ctx.printRows(
				ctx.history.map((entry, index) => [String(index + 1), entry]),
			);
		},
	},

	clear: {
		description: "clear the screen",
		run(ctx) {
			ctx.clear();
		},
	},

	exit: {
		description: "back to the website",
		run(ctx) {
			ctx.close();
		},
	},

	sudo: {
		description: "nice try",
		hidden: true,
		run(ctx) {
			ctx.print("visitor is not in the sudoers file.", { className: "t-error" });
			ctx.print("This incident has been reported.", { className: "t-dim" });
		},
	},

	rm: {
		description: "no",
		hidden: true,
		run(ctx) {
			ctx.print("rm: permission denied, this one is load bearing.", {
				className: "t-error",
			});
		},
	},

	vim: {
		description: "a trap",
		hidden: true,
		run(ctx) {
			ctx.print("you are now trapped. type `exit` to leave (it works here).", {
				className: "t-dim",
			});
		},
	},
};
