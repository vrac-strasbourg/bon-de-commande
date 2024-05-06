"use client";

import { useState, useEffect } from "react";

export default function PrintSizer(props) {
  const defaultMin = 0.48;
  const defaultMax = 1.25;
  const [min, setMin] = useState(defaultMin);
  const [max, setMax] = useState(defaultMax);
  const [currentSize, setCurrentSize] = useState((defaultMin + defaultMax) / 2);
  const [ready, setReady] = useState(false);
  const activate = () => {
    const srcNode = document.getElementById("ps-style");
    if (srcNode) {
      setReady(true);
    }
    setMin(defaultMin);
    setMax(defaultMax);
  };

  useEffect(() => {
    const srcNode = document.getElementById("ps-style");
    const value = (min + max) / 2;
    setCurrentSize(value);
    srcNode.innerText = `:root { --print-font-size: ${value * 100}%; }`;
  }, [min, max]);

  const resize = (handler) => {
    handler(currentSize);
  };
  return (
    <div className="print-sizer">
      <button
        disabled={!ready}
        onClick={() => resize(setMax)}
        className="ps-action"
      >
        Plus petit
      </button>
      <button
        disabled={!ready}
        onClick={() => resize(setMin)}
        className="ps-action"
      >
        Plus grand
      </button>
      <button onClick={activate}>{ready ? "Reset" : "Set"}</button>
      <div>{Math.round(currentSize * 100) / 100}</div>
      <style id="ps-style" />
    </div>
  );
}
