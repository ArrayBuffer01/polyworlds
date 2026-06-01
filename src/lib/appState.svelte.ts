import { page } from "$app/state";
import { createContext } from "svelte";
import type { User } from "../types/User";

export class AppState {
  user = $state<User | null | undefined>(null);
  landingPageActive = $derived<boolean>(this.user == null && page.url.pathname === "/");

  constructor(user?: User) {
    if (user) {
      this.user = user;
    }
  }
}

export const [getAppContext, setAppContext] = createContext<AppState>();
