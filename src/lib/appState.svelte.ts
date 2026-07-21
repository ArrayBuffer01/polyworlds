import { page } from "$app/state";
import { createContext } from "svelte";
import type { User } from "../types/User";
import { browser } from "$app/env";
import { getMainDomain } from "./domainUtils";

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
      cookieStore.set({
        name: "theme",
        value: newTheme,
        domain: getMainDomain(page.url.hostname)
      })
      document.documentElement.classList.toggle("dark", newTheme === "dark");
    }
  }

  get isLoggedIn() {
    return this.user != null && this.user != undefined;
  }
}

export const [getAppContext, setAppContext] = createContext<AppState>();
