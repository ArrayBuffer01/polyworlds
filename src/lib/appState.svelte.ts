import { createContext } from "svelte";

export interface User {
  username: string;
}
export class AppState {
  user = $state<User | null>(null);
}

export const [getAppContext, setAppContext] = createContext<AppState>();