import { clearBroadcastIntervalRef, getBroadcastIntervalRef } from "./startBroadcast";

export function stopBroadcast() {
  const intervalRef = getBroadcastIntervalRef();
  if (!intervalRef) return;

  clearInterval(intervalRef);
  clearBroadcastIntervalRef();
}
