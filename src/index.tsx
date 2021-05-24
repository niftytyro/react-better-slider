import React, { useEffect, useState } from "react";
import { useMemo } from "react";
import { useRef } from "react";
import { useCallback } from "react";

export interface SliderProps {
  disabledBackground?: string;
  disabledDirection?: "ltr" | "rtl";
  disabledFillStyles?: React.CSSProperties;
  disabledPosition?: number;
  fillBackground?: string;
  fillStyles?: React.CSSProperties;
  max?: number;
  min?: number;
  trackBackground?: string;
  trackCursor?: "auto" | "default" | "none" | "pointer";
  trackHeight?: string | number;
  trackStyles?: React.CSSProperties;
  thumbBackground?: string;
  thumbBorderRadius?: string | number;
  thumbBorder?: string | number;
  thumbHeight?: string | number;
  thumbStyles?: React.CSSProperties;
  thumbWidth?: string | number;
  value: number;
  onChange: (newResponseValue: number) => void;
}

const RangeSlider: React.FC<SliderProps> = ({
  disabledBackground = "#ddd",
  disabledDirection = "ltr",
  disabledFillStyles,
  disabledPosition,
  fillBackground = "#000",
  fillStyles,
  max,
  min,
  trackBackground = "#ccc",
  trackCursor = "pointer",
  trackHeight = "4px",
  trackStyles,
  thumbBackground = "#000",
  thumbBorder,
  thumbBorderRadius = "9999px",
  thumbHeight = "16px",
  thumbStyles,
  thumbWidth = "16px",
  value,
  onChange,
}) => {
  const [fillWidth, setFillWidth] = useState<number>(0);
  const [dragging, setDragging] = useState<boolean>(false);
  const pathRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const [disabledFill, setDisabledFill] = useState<number>(0);
  const disableStart = useMemo(() => {
    if (disabledDirection === "rtl") {
      if (pathRef.current)
        return pathRef.current.getBoundingClientRect().width - disabledFill;
      return 0;
    }
    return 0;
  }, [disabledDirection, disabledFill]);

  const calculateDisabledFill = useCallback(() => {
    const maxValue: number = max ?? 100;
    const minValue: number = min ?? 0;
    const disabledPos = disabledPosition ?? 0;
    const disabledFraction = (disabledPos - minValue) / (maxValue - minValue);
    if (disabledPosition) {
      if (disabledDirection === undefined || disabledDirection === "ltr")
        return disabledFraction * (pathRef.current?.clientWidth ?? 0);
      else if (disabledDirection === "rtl")
        if (pathRef.current)
          return (
            pathRef.current.getBoundingClientRect().width -
            disabledFraction * (pathRef.current?.clientWidth ?? 0)
          );
    }
    return 0;
  }, [disabledDirection, disabledPosition, max, min]);

  const onPositionChange = useCallback(
    (newPosition: number) => {
      const maxValue: number = max ?? 100;
      const minValue: number = min ?? 0;
      const disabledPos = disabledPosition ?? 0;
      const disabledFraction = (disabledPos - minValue) / (maxValue - minValue);

      const scale: number = (maxValue - minValue) / 100;
      if (newPosition > 100) newPosition = 100;
      if (newPosition < 0) newPosition = 0;
      if (disabledDirection === "rtl") {
        if (newPosition > disabledFraction * 100)
          newPosition = disabledFraction * 100;
      } else if (newPosition < disabledFraction * 100)
        newPosition = disabledFraction * 100;
      onChange(minValue + Math.round(newPosition * scale));
      if (newPosition === 0) setFillWidth(0);
      else
        setFillWidth(
          ((minValue + Math.round(newPosition * scale) * 100) /
            (maxValue - minValue + 1) /
            100) *
            (pathRef.current ? pathRef.current.clientWidth : 0)
        );
    },
    [max, min, onChange, disabledDirection, disabledPosition]
  );

  useEffect(() => {
    const drag = (e: MouseEvent) => {
      if (dragging && thumbRef.current && pathRef.current) {
        const diff = e.clientX - thumbRef.current.getBoundingClientRect().right;

        const mousePosition =
          ((thumbRef.current.getBoundingClientRect().right +
            diff -
            pathRef.current.getBoundingClientRect().x) /
            pathRef.current.getBoundingClientRect().width) *
          100;

        onPositionChange(Math.round(mousePosition));
      }
    };
    const stopDrag = () => {
      setDragging(false);
    };
    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", stopDrag);
    return () => {
      document.removeEventListener("mousemove", drag);
      document.removeEventListener("mouseup", stopDrag);
    };
  }, [dragging, onPositionChange]);

  useEffect(() => {
    setDisabledFill(calculateDisabledFill());
    if (disabledDirection === "rtl") {
      if (disableStart <= fillWidth)
        onPositionChange(
          disabledPosition
            ? ((disabledPosition - (min ?? 0)) / ((max ?? 0) - (min ?? 0))) *
                100
            : 0
        );
    } else if (calculateDisabledFill() >= fillWidth)
      onPositionChange(
        disabledPosition
          ? ((disabledPosition - (min ?? 0)) / ((max ?? 0) - (min ?? 0))) * 100
          : 0
      );
  }, [calculateDisabledFill]);

  useEffect(() => {
    const maxValue: number = max ?? 100;
    onPositionChange(((value - (min ?? 0)) / (maxValue - (min ?? 0))) * 100);
  }, []);

  return (
    <div style={{ width: "100%", flex: "1 1 0%" }}>
      <div
        onClick={(e) => {
          const clientX = e.clientX;
          const clientRect = e.currentTarget.getBoundingClientRect();
          const mousePosition =
            ((clientX - clientRect.x) / clientRect.width) * 100;
          onPositionChange(Math.round(mousePosition));
        }}
        ref={pathRef}
        style={{
          position: "relative",
          width: "100%",
          height: trackHeight,
          background: trackBackground,
          cursor: trackCursor,
          ...trackStyles,
        }}
      >
        <div
          style={{
            position: "absolute",
            width: `${fillWidth + 8}px`,
            height: "100%",
            backgroundColor: fillBackground,
            ...fillStyles,
          }}
        />
        <div
          style={{
            position: "absolute",
            width: `${disabledFill ? disabledFill + 8 : 0}px`,
            height: "100%",
            left: disableStart,
            background: disabledBackground,
            ...disabledFillStyles,
          }}
        />
        <div
          ref={thumbRef}
          onMouseDown={() => setDragging(true)}
          onMouseUp={() => setDragging(false)}
          style={{
            position: "absolute",
            left: `${fillWidth}px`,
            top: "50%",
            msTransform: "translateY(-50%)",
            transform: "translateY(-50%)",
            width: thumbWidth,
            height: thumbHeight,
            backgroundColor: thumbBackground,
            borderRadius: thumbBorderRadius,
            border: thumbBorder,
            ...thumbStyles,
          }}
        />
      </div>
    </div>
  );
};

export default RangeSlider;
