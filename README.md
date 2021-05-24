# react-better-slider

A simple slider component which provides you better features like **disabling** input upto a value.

## Installation

`npm i react-better-slider`  
or  
`yarn add react-better-slider`

## Usage

```typescript
import React from "react";
import BetterSlider from "react-better-slider";

const DemoApp: React.FC = () => {
  const [value, setValue] = useState(0);
  return (
    <Slider
      disabledPosition={24}
      value={value}
      onChange={(newResponse: number) => setValue(newResponse)}
    />
  );
};

export default DemoApp;
```

## Props

| Name                | Type                                       | Default   |
| ------------------- | ------------------------------------------ | --------- |
| disabledBackground? | string                                     | "#ddd"    |
| disabledDirection?  | "ltr" \| "rtl"                             | "ltr"     |
| disabledFillStyles? | React.CSSProperties                        |
| disabledPosition?   | number                                     |
| fillBackground?     | string                                     | "#000"    |
| fillStyles?         | React.CSSProperties                        |
| max?                | number                                     |
| min?                | number                                     |
| trackBackground?    | string                                     |
| trackCursor?        | "auto" \| "default" \| "none" \| "pointer" | "pointer" |
| trackHeight?        | string \| number                           | "4px"     |
| trackStyles?        | React.CSSProperties                        |
| thumbBackground?    | string                                     | "#000"    |
| thumbBorder?        | string \| number                           |
| thumbBorderRadius?  | string \| number                           | "9999px"  |
| thumbHeight?        | string \| number                           | "16px"    |
| thumbStyles?        | React.CSSProperties                        |
| thumbWidth?         | string \| number                           | "16px"    |
| value               | number                                     |
| onChange            | function(newValue: number)=>void           |
