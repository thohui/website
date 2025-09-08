const THEME_KEY = "theme";

type Theme = "dark" | "light";

const root = document.documentElement;

export function getTheme() {
	const value = localStorage.getItem(THEME_KEY) === "dark" ? "dark" : "light";
	if (!value) {
		setTheme("light");
		return "light";
	}
	return value;
};


export function initTheme() {
	const theme = getTheme();
	root.setAttribute("data-theme", theme);
}

export function setTheme(theme: Theme) {
	localStorage.setItem(THEME_KEY, theme);
	root.setAttribute("data-theme", theme);
};
