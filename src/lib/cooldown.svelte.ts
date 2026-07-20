import { SvelteDate } from "svelte/reactivity";

export class Cooldown {
  public duration: number = $state(0);
  public now: SvelteDate = new SvelteDate();
  public startedAt: SvelteDate = new SvelteDate();
  public msLeft = $derived(
    this.startedAt != null
      ? Math.max(0, this.startedAt.getTime() + this.duration - this.now.getTime())
      : 0
  );
  public isActive = $derived(this.msLeft > 0);

  public countdown = $derived.by(() => {
    if (!this.isActive) return null;
    if (this.startedAt) {
      console.log("STARTED AT !!!! " + this.startedAt.getTime());
    }
    const totalSeconds = Math.ceil(this.msLeft / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return this.duration >= 3_600_000
      ? [hours, minutes, seconds].map((v) => v.toString().padStart(2, "0")).join(":")
      : `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  });

  constructor(initialTime?: number, duration?: number) {
    this.initialTime = initialTime ?? null;
    if (duration) {
      this.duration = duration;
    }

    this.now.setTime(Date.now());
  }

  set initialTime(newInitialTime: number | null) {
    if (!newInitialTime) {
      this.startedAt.setTime(0);
    } else if (!this.startedAt) {
      this.startedAt = new SvelteDate(newInitialTime);
    } else {
      this.startedAt.setTime(newInitialTime);
    }
  }

  get initialTime() {
    return this.startedAt === null ? null : this.startedAt.getTime();
  }

  tick() {
    this.now.setTime(Date.now());
  }
}
