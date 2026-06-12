import { browser } from "$app/env";

export class Theme {
  #currentTheme = $state("light");

  set theme(newTheme: string) {
    this.#currentTheme = newTheme;

    if (browser) {
      cookieStore.set("theme", newTheme);
      document.documentElement.classList.toggle("dark", newTheme === "dark");
    }
  }

  get theme() {
    return this.#currentTheme;
  }
}

export const themeState = new Theme();
