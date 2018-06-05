// @flow
/* eslint-disable react/jsx-filename-extension, import/no-named-as-default-member */

import * as React from "react";
import {
  render,
  TextStyles,
  Text,
  View,
  Page,
  Artboard,
  Document
} from "react-sketchapp";
// import designSystem from "./designSystem";

// import Label from "./components/Label";
// import Palette from "./components/Palette";
// import Section from "./components/Section";
// import TypeSpecimen from "./components/TypeSpecimen";

const App = ({ system }) => (
  <Document>
    <Page name="Typography">
      <Artboard>
        <Text>Test Is Working</Text>
      </Artboard>
    </Page>
  </Document>
);

export default () => {
  render(<App />);
};
