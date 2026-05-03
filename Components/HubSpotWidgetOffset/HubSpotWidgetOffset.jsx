"use client";

import { useEffect } from "react";

const MOBILE_QUERY = "(max-width: 899px)";
const MOBILE_BOTTOM_OFFSET = "calc(96px + env(safe-area-inset-bottom))";

function getHubSpotContainers() {
  const containers = [
    ...document.querySelectorAll("#hubspot-messages-iframe-container"),
  ];
  const conversationIframe = document.querySelector(
    "iframe#hubspot-conversations-iframe"
  );

  if (conversationIframe) {
    const iframeContainer =
      conversationIframe.closest("#hubspot-messages-iframe-container") ||
      conversationIframe.parentElement;

    if (iframeContainer && !containers.includes(iframeContainer)) {
      containers.push(iframeContainer);
    }
  }

  return containers;
}

export default function HubSpotWidgetOffset() {
  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_QUERY);

    const updateWidgetPosition = () => {
      getHubSpotContainers().forEach((container) => {
        if (mediaQuery.matches) {
          container.style.setProperty("bottom", MOBILE_BOTTOM_OFFSET, "important");
          container.style.setProperty("right", "12px", "important");
        } else {
          container.style.removeProperty("bottom");
          container.style.removeProperty("right");
        }
      });
    };

    const observer = new MutationObserver(updateWidgetPosition);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "class"],
    });

    updateWidgetPosition();
    window.addEventListener("resize", updateWidgetPosition);
    mediaQuery.addEventListener?.("change", updateWidgetPosition);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateWidgetPosition);
      mediaQuery.removeEventListener?.("change", updateWidgetPosition);
    };
  }, []);

  return null;
}
