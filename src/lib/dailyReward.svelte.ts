import { page } from "$app/state";
import { createContext } from "svelte";
import { ONE_DAY } from "./constants";

export class DailyRewardState {
  #now = $state(Date.now());
  #lastReward = $derived<number>(page.data.lastReward?.getTime() || 0);
  #msUntilNextReward = $derived(
    !this.lastReward ? 0 : Math.max(0, this.lastReward + ONE_DAY - this.now)
  );
  #rewardAvailable = $derived<boolean>(!this.lastReward || this.msUntilNextReward === 0);

  countdown = $derived.by(() => {
    if (this.rewardAvailable) return null;
    const totalSeconds = Math.ceil(this.msUntilNextReward / 1000);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours} h ${minutes} min ${seconds} s`;
  });

  get lastReward() {
    return this.#lastReward;
  }

  get now() {
    return this.#now;
  }

  get msUntilNextReward() {
    return this.#msUntilNextReward;
  }

  get rewardAvailable() {
    return this.#rewardAvailable;
  }

  tick() {
    this.#now = Date.now();
  }
}

export const [getRewardContext, setRewardContext] = createContext<DailyRewardState>();
