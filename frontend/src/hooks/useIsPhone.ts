import { useState } from "react";

function detectIsPhone(): boolean {
  if (typeof navigator === "undefined") return false;

  const uaData: any = (navigator as any).userAgentData;
  if (uaData && typeof uaData.mobile === "boolean") {
    return uaData.mobile;
  }

  const ua = navigator.userAgent || "";
  return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|Opera Mini|IEMobile|Windows Phone/i.test(
    ua,
  );
}

export default function useIsPhone(): { isPhone: boolean } {
  // compute once on initial render, device type won't change during a session
  const [isPhone] = useState<boolean>(() => detectIsPhone());
  return { isPhone };
}
