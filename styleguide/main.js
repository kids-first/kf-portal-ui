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
import {omit} from 'lodash';
import designSystem from "./designSystem";

import Label from "./components/Label";
import Palette from "./components/Palette";
import Section from "./components/Section";
import TypeSpecimen from "./components/TypeSpecimen";

const App = ({ system }) => (
  <Document>
    <Page name="Typography">
      <Artboard>
      
        <Section title="Fonts">
          {Object.keys(system.fonts).map((name) => (
            <View style={{ flexDirection: "row", marginBottom: 24 }} >
              <Text style={{fontFamily: system.fonts[name], fontWeight: 'bold', fontSize: 32}}>
                {system.fonts[name]} 
              </Text>
            </View>
          ))}
        </Section>

        <Section title="Headers">
          {Object.keys(omit(system.typography, 'Body Copy')).map(name => (
            <TypeSpecimen key={name} name={name} style={TextStyles.get(name)} > Heading {name} </TypeSpecimen>
          ))}
        </Section>

        <Section title="Body Copy">
        <TypeSpecimen name={'Body Copy'} style={{...system.typography['Body Copy'], maxWidth: 480}} >  
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam at eleifend ante. Donec ante lectus, 
              hendrerit vitae dui a, efficitur sollicitudin nunc. Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
              Aenean vitae nisl massa. Praesent quis porta tortor. Aenean sit amet posuere lorem, a rhoncus diam. Ut eget est varius, 
              accumsan velit ut, feugiat nibh. Cras dignissim orci lorem, a tincidunt erat dapibus eget. Aenean eu iaculis 
              ipsum. Quisque varius facilisis dictum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sit amet semper dolor, vitae dignissim nisi. Nullam turpis mauris, euismod eu ipsum et, pharetra bibendum ipsum. In in nisi malesuada, luctus metus et, consequat ex.
        </TypeSpecimen>

        </Section>
        
      </Artboard>
    </Page>

    <Page name="Color Palette">
      <Text>Foobar 2</Text>
    </Page>
  </Document>
);

export default () => {
  TextStyles.create(
    {
      context,
      clearExistingStyles: true
    },
    designSystem.typography
  );
  render(<App system={designSystem} />);
};
