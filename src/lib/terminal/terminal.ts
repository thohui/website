import { COMMANDS } from "./commands";
import type {
	CommandContext,
	CommandMap,
	PrintOptions,
	Segment,
	TerminalData,
} from "./types";

const HISTORY_KEY = "terminal:history";
const MAX_HISTORY = 50;
const PROMPT = "visitor@thohui:~$";
const BOOT_TEXT = "type `help` for the list of commands, esc to leave.";

interface Elements {
	root: HTMLElement;
	body: HTMLElement;
	output: HTMLElement;
	mirror: HTMLElement;
	input: HTMLInputElement;
}

export class Terminal {
	private el: Elements;
	private data: TerminalData;
	private commands: CommandMap = COMMANDS;
	private history: string[] = [];
	private cursor = 0;
	private draft = "";
	private booted = false;
	private busy = false;
	private lastFocused: HTMLElement | null = null;

	constructor(el: Elements, data: TerminalData) {
		this.el = el;
		this.data = data;
		this.history = this.loadHistory();
		this.cursor = this.history.length;

		this.el.input.addEventListener("keydown", this.onKeyDown);
		this.el.input.addEventListener("input", this.renderInput);
		this.el.input.addEventListener("click", this.renderInput);
		this.el.input.addEventListener("select", this.renderInput);
		this.el.body.addEventListener("mouseup", this.onBodyClick);
		this.renderInput();
	}

	isOpen(): boolean {
		return !this.el.root.hidden;
	}

	open(): void {
		if (this.isOpen()) return;
		this.lastFocused = document.activeElement as HTMLElement | null;
		this.el.root.hidden = false;
		this.el.root.setAttribute("aria-hidden", "false");
		document.documentElement.classList.add("terminal-open");
		this.setPageInert(true);
		requestAnimationFrame(() => this.el.root.classList.add("open"));
		this.el.input.focus({ preventScroll: true });

		if (!this.booted) {
			this.booted = true;
			this.print(BOOT_TEXT);
			this.print();
		}
	}

	close(): void {
		if (!this.isOpen()) return;
		this.el.root.classList.remove("open");
		this.el.root.setAttribute("aria-hidden", "true");
		this.el.root.hidden = true;
		document.documentElement.classList.remove("terminal-open");
		this.setPageInert(false);
		if (location.hash === "#terminal") {
			history.replaceState(null, "", location.pathname + location.search);
		}
		this.lastFocused?.focus?.({ preventScroll: true });
	}

	private setPageInert(inert: boolean): void {
		for (const child of Array.from(document.body.children)) {
			if (child !== this.el.root) (child as HTMLElement).inert = inert;
		}
	}

	print(text = "", options: PrintOptions = {}): void {
		const line = document.createElement("div");
		line.className = `t-line${options.className ? ` ${options.className}` : ""}`;

		if (options.prefix) {
			const prefix = document.createElement("span");
			prefix.className = "t-prefix";
			prefix.textContent = options.prefix;
			line.appendChild(prefix);
		}

		line.appendChild(document.createTextNode(text));
		this.el.output.appendChild(line);
		this.scroll();
	}

	printLink(href: string, label: string, options: PrintOptions = {}): void {
		const line = document.createElement("div");
		line.className = `t-line${options.className ? ` ${options.className}` : ""}`;

		if (options.prefix) {
			const prefix = document.createElement("span");
			prefix.className = "t-prefix";
			prefix.textContent = options.prefix;
			line.appendChild(prefix);
		}

		const anchor = document.createElement("a");
		anchor.href = href;
		anchor.textContent = label;
		if (href.startsWith("http")) {
			anchor.target = "_blank";
			anchor.rel = "noopener";
		}
		line.appendChild(anchor);
		this.el.output.appendChild(line);
		this.scroll();
	}

	printRows(rows: [string, string][], options: PrintOptions = {}): void {
		const width = rows.reduce((max, [key]) => Math.max(max, key.length), 0);
		for (const [key, value] of rows) {
			const line = document.createElement("div");
			line.className = "t-line";
			const label = document.createElement("span");
			label.className = "t-key";
			label.textContent = `  ${key.padEnd(width + 2, " ")}`;
			line.appendChild(label);
			line.appendChild(document.createTextNode(value));
			if (options.className) line.classList.add(options.className);
			this.el.output.appendChild(line);
		}
		this.scroll();
	}

	printSegments(segments: Segment[], options: PrintOptions = {}): void {
		const line = document.createElement("div");
		line.className = `t-line${options.className ? ` ${options.className}` : ""}`;

		for (const segment of segments) {
			const span = document.createElement("span");
			span.textContent = segment.text;
			if (segment.className) span.className = segment.className;
			if (segment.background) span.style.backgroundColor = segment.background;
			line.appendChild(span);
		}

		this.el.output.appendChild(line);
		this.scroll();
	}

	clear(): void {
		this.el.output.replaceChildren();
	}

	private echoCommand(value: string): void {
		const line = document.createElement("div");
		line.className = "t-line t-echo";
		const prompt = document.createElement("span");
		prompt.className = "t-prompt";
		prompt.textContent = PROMPT;
		line.appendChild(prompt);
		line.appendChild(document.createTextNode(` ${value}`));
		this.el.output.appendChild(line);
		this.scroll();
	}

	private scroll(): void {
		this.el.body.scrollTop = this.el.body.scrollHeight;
	}

	private renderInput = (): void => {
		const value = this.el.input.value;
		const position = this.el.input.selectionStart ?? value.length;
		const before = value.slice(0, position);
		const at = value.slice(position, position + 1);
		const after = value.slice(position + 1);

		const head = document.createElement("span");
		head.textContent = before;

		const caret = document.createElement("span");
		caret.className = "t-caret";
		caret.textContent = at || " ";

		const tail = document.createElement("span");
		tail.textContent = after;

		this.el.mirror.replaceChildren(head, caret, tail);
	};

	private onBodyClick = (): void => {
		const selection = window.getSelection();
		if (selection && selection.toString().length > 0) return;
		this.el.input.focus({ preventScroll: true });
	};

	private onKeyDown = (event: KeyboardEvent): void => {
		if (event.key === "Escape") {
			event.preventDefault();
			this.close();
			return;
		}

		if (event.key === "Enter") {
			event.preventDefault();
			void this.submit();
			return;
		}

		if (event.key === "Tab") {
			event.preventDefault();
			this.complete();
			return;
		}

		if (event.key === "ArrowUp") {
			event.preventDefault();
			this.walkHistory(-1);
			return;
		}

		if (event.key === "ArrowDown") {
			event.preventDefault();
			this.walkHistory(1);
			return;
		}

		if (event.ctrlKey && (event.key === "l" || event.key === "L")) {
			event.preventDefault();
			this.clear();
			return;
		}

		if (event.ctrlKey && (event.key === "c" || event.key === "C")) {
			if (window.getSelection()?.toString()) return;
			event.preventDefault();
			this.echoCommand(`${this.el.input.value}^C`);
			this.setValue("");
			return;
		}

		requestAnimationFrame(this.renderInput);
	};

	private setValue(value: string): void {
		this.el.input.value = value;
		this.el.input.setSelectionRange(value.length, value.length);
		this.renderInput();
	}

	private walkHistory(direction: number): void {
		if (this.history.length === 0) return;
		if (this.cursor === this.history.length) this.draft = this.el.input.value;

		const next = Math.min(
			Math.max(this.cursor + direction, 0),
			this.history.length,
		);
		this.cursor = next;
		this.setValue(next === this.history.length ? this.draft : this.history[next]!);
	}

	private complete(): void {
		const value = this.el.input.value;
		if (value.includes(" ")) return;

		const prefix = value.toLowerCase();
		const matches = Object.keys(this.commands).filter(
			(name) => name.startsWith(prefix) && !this.commands[name]?.hidden,
		);

		if (matches.length === 0) return;
		if (matches.length === 1) {
			this.setValue(`${matches[0]!} `);
			return;
		}

		this.echoCommand(value);
		this.print(matches.join("  "), { className: "t-dim" });
	}

	private async submit(): Promise<void> {
		if (this.busy) return;

		const raw = this.el.input.value;
		const trimmed = raw.trim();
		this.echoCommand(raw);
		this.setValue("");

		if (trimmed.length === 0) return;

		this.remember(trimmed);

		const [name, ...args] = trimmed.split(/\s+/);
		const command = this.commands[name!.toLowerCase()];

		if (!command) {
			this.print(`${name}: command not found`, { className: "t-error" });
			this.print("type `help` to see what works.", { className: "t-dim" });
			return;
		}

		this.busy = true;
		try {
			await command.run(this.context(args));
		} catch (error) {
			this.print(`${name}: ${String(error)}`, { className: "t-error" });
		} finally {
			this.busy = false;
			this.scroll();
		}
	}

	private context(args: string[]): CommandContext {
		return {
			args,
			data: this.data,
			commands: this.commands,
			history: this.history,
			print: (text, options) => this.print(text, options),
			printLink: (href, label, options) => this.printLink(href, label, options),
			printRows: (rows, options) => this.printRows(rows, options),
			printSegments: (segments, options) =>
				this.printSegments(segments, options),
			clear: () => this.clear(),
			close: () => this.close(),
		};
	}

	private remember(command: string): void {
		if (this.history[this.history.length - 1] !== command) {
			this.history.push(command);
			if (this.history.length > MAX_HISTORY) this.history.shift();
			this.saveHistory();
		}
		this.cursor = this.history.length;
		this.draft = "";
	}

	private loadHistory(): string[] {
		try {
			const stored = sessionStorage.getItem(HISTORY_KEY);
			const parsed: unknown = stored ? JSON.parse(stored) : [];
			return Array.isArray(parsed)
				? parsed.filter((entry): entry is string => typeof entry === "string")
				: [];
		} catch {
			return [];
		}
	}

	private saveHistory(): void {
		try {
			sessionStorage.setItem(HISTORY_KEY, JSON.stringify(this.history));
		} catch {}
	}
}

export function mountTerminal(root: HTMLElement, data: TerminalData): Terminal {
	const el: Elements = {
		root,
		body: root.querySelector<HTMLElement>("[data-terminal-body]")!,
		output: root.querySelector<HTMLElement>("[data-terminal-output]")!,
		mirror: root.querySelector<HTMLElement>("[data-terminal-mirror]")!,
		input: root.querySelector<HTMLInputElement>("[data-terminal-input]")!,
	};

	return new Terminal(el, data);
}
