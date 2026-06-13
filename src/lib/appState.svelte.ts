import { page } from "$app/state";
import { createContext } from "svelte";
import type { User } from "../types/User";
import { browser } from "$app/env";

export class AppState {
  user = $state<User | null | undefined>(null);
  landingPageActive = $derived<boolean>(this.user == null && page.url.pathname === "/");
  #currentTheme = $state<string>("light");
  
  constructor(user?: User) {
    if (user) {
      this.user = user;
    }
  }

  get theme() {
    return this.#currentTheme;
  }

  set theme(newTheme: string) {
    this.#currentTheme = newTheme;

    if (browser) {
      cookieStore.set("theme", newTheme);
      document.documentElement.classList.toggle("dark", newTheme === "dark");
    }
  }
}

export const [getAppContext, setAppContext] = createContext<AppState>();
