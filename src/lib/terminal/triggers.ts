const SECRET_KEYS = ["`", "~", ":"];
const SECRET_WORDS = ["sudo"];

const BUFFER_SIZE = Math.max(...SECRET_WORDS.map((word) => word.length));

function isTyping(target: EventTarget | null): boolean {
	const element = target as HTMLElement | null;
	if (!element) return false;
	const tag = element.tagName;
	return (
		tag === "INPUT" ||
		tag === "TEXTAREA" ||
		tag === "SELECT" ||
		element.isContentEditable
	);
}

export function watchTriggers(open: () => void): void {
	let typed = "";

	window.addEventListener("keydown", (event) => {
		if (event.ctrlKey || event.metaKey || event.altKey) return;
		if (isTyping(event.target)) return;

		if (SECRET_KEYS.includes(event.key)) {
			event.preventDefault();
			open();
			return;
		}

		const key = event.key.toLowerCase();
		if (key.length !== 1) return;

		typed = (typed + key).slice(-BUFFER_SIZE);
		if (SECRET_WORDS.some((word) => typed.endsWith(word))) {
			typed = "";
			open();
		}
	});

	const checkHash = () => {
		if (location.hash === "#terminal") open();
	};

	window.addEventListener("hashchange", checkHash);
	checkHash();
}
