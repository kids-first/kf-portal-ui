// @flow
/* eslint-disable react/jsx-filename-extension, import/no-named-as-default-member */

import * as React from 'react';
import { render, TextStyles, Text, View, Page, Artboard, Document } from 'react-sketchapp';
import { omit } from 'lodash';
import designSystem from './designSystem';

import Label from './components/Label';
import Palette from './components/Palette';
import Section from './components/Section';
import TypeSpecimen from './components/TypeSpecimen';

const App = ({ system }) => (
  <Document>
    <Page name="Color Palette">
      <Artboard>
        <Section title="Color Palette">
          <Palette colors={system.colors} />
        </Section>
      </Artboard>
    </Page>

    <Page name="Typography">
      <Artboard>
        <Section title="Fonts">
          <View
            style={{
              flexDirection: 'row',
              marginBottom: 24,
              padding: 15,
              borderRadius: 5,
              backgroundColor: system.colors.greyScale10.hex,
            }}
          >
            <Text style={{ fontFamily: 'Mono', fontWeight: 'bold' }}>
              @import
              url('https://fonts.googleapis.com/css?family=Montserrat:300,400|Open+Sans:400,500,700');
            </Text>
          </View>
          {Object.keys(system.fonts).map(name => (
            <View style={{ flexDirection: 'row', marginBottom: 24 }}>
              <Text style={{ fontFamily: system.fonts[name], fontWeight: 'bold', fontSize: 32 }}>
                {system.fonts[name]}
              </Text>
            </View>
          ))}
        </Section>

        <Section title="Headers">
          {Object.keys(omit(system.typography, 'Body Copy', 'links')).map(name => (
            <TypeSpecimen key={name} name={name} style={TextStyles.get(name)}>
              {' '}
              Heading {name}{' '}
            </TypeSpecimen>
          ))}
        </Section>

        <Section title="Body Copy">
          <TypeSpecimen
            name={'Body Copy'}
            style={{ ...system.typography['Body Copy'], maxWidth: 480 }}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam at eleifend ante. Donec
            ante lectus, hendrerit vitae dui a, efficitur sollicitudin nunc. Lorem ipsum dolor sit
            amet, consectetur adipiscing elit. Aenean vitae nisl massa. Praesent quis porta tortor.
            Aenean sit amet posuere lorem, a rhoncus diam. Ut eget est varius, accumsan velit ut,
            feugiat nibh. Cras dignissim orci lorem, a tincidunt erat dapibus eget. Aenean eu
            iaculis ipsum. Quisque varius facilisis dictum. Lorem ipsum dolor sit amet, consectetur
            adipiscing elit. Cras sit amet semper dolor, vitae dignissim nisi. Nullam turpis mauris,
            euismod eu ipsum et, pharetra bibendum ipsum. In in nisi malesuada, luctus metus et,
            consequat ex.
          </TypeSpecimen>
        </Section>

        <Section title="Links">
          <TypeSpecimen
            name={'internal link'}
            style={{ ...system.typography['Body Copy'], maxWidth: 480 }}
          >
            Lorem ipsum dolor sit amet,{' '}
            <Text style={{ ...system.links.internalLink, fontWeight: 'bold' }}>internal link</Text>{' '}
            consectetur adipiscing elit. Aliquam at eleifend ante. Donec ante lectus, hendrerit
            vitae dui a, efficitur sollicitudin nunc.
          </TypeSpecimen>

          <TypeSpecimen
            name={'external link'}
            style={{ ...system.typography['Body Copy'], maxWidth: 480 }}
          >
            Lorem ipsum dolor sit amet,
            <Text style={{ ...system.links.externalLink, fontWeight: 'bold' }}>external link</Text>
            consectetur adipiscing elit. Aliquam at eleifend ante. Donec ante lectus, hendrerit
            vitae dui a, efficitur sollicitudin nunc.
          </TypeSpecimen>
        </Section>
      </Artboard>
    </Page>
  </Document>
);

export default context => {
  TextStyles.create(
    {
      context,
      clearExistingStyles: true,
    },
    designSystem.typography,
  );
  render(<App system={designSystem} />);
};
