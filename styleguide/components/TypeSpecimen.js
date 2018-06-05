import * as React from "react";
import { View, Text } from "react-sketchapp";
import Label from "./Label";

const TypeSpecimen = ({ name, style, children }) => {
  return (
    <View
      name={`TypeSpecimen-${name}`}
      style={{ flexDirection: "row", marginBottom: 24 }}
    >
      <View style={{ width: 100 }}>
      <Label>{`${style.fontSize} / ${style.lineHeight}`}</Label>
      <Label style={{fontSize: 12, lineHeight: 12, fontFamiy: style.fontFamily}}>{`${style.fontFamily}`}</Label>
    </View>
      <Text
        style={{
          ...style
        }}
      >
       {children} 
      </Text>
    </View>
  );
};

export default TypeSpecimen;
