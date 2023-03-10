import React, { useEffect, useRef } from "react";

let tvScriptLoadingPromise;

export default function TradingViewWidget({ stock, width }) {
  const onLoadScriptRef = useRef();
  console.log(width);
  useEffect(() => {
    onLoadScriptRef.current = createWidget;

    if (!tvScriptLoadingPromise) {
      tvScriptLoadingPromise = new Promise((resolve) => {
        const script = document.createElement("script");
        script.id = "tradingview-widget-loading-script";
        script.src = "https://s3.tradingview.com/tv.js";
        script.type = "text/javascript";
        script.onload = resolve;

        document.head.appendChild(script);
      });
    }

    tvScriptLoadingPromise.then(
      () => onLoadScriptRef.current && onLoadScriptRef.current()
    );

    return () => (onLoadScriptRef.current = null);

    function createWidget() {
      if (
        document.getElementById(`tradingview_${stock}`) &&
        "TradingView" in window
      ) {
        new window.TradingView.widget({
          width: 1500 / width,
          height: 610,
          symbol: `${stock}`,
          interval: "D",
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1",
          locale: "en",
          toolbar_bg: "#f1f3f6",
          enable_publishing: false,
          allow_symbol_change: true,
          hide_side_toolbar: false,
          container_id: `tradingview_${stock}`,
        });
      }
    }
  }, []);

  return (
    <div className="tradingview-widget-container">
      <div id={`tradingview_${stock}`} />
    </div>
  );
}
