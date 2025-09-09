export const THEME_KEY = "theme";

export type Theme = "dark" | "light";

const root = document.documentElement;

export function getTheme() {
	const value = localStorage.getItem(THEME_KEY) === "dark" ? "dark" : "light";
	if (!value) {
		return "light";
	}
	return value;
};

export function setTheme(theme: Theme) {
	localStorage.setItem(THEME_KEY, theme);
	root.setAttribute("data-theme", theme);
};
