import { canUseDOM } from "./supports";

export const win = canUseDOM ? window : null;
export const doc = canUseDOM ? document : null;
