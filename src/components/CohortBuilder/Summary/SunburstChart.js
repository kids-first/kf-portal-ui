import React, { useState } from 'react';
import { Hint, Sunburst as SunburstVis } from 'react-vis';

const generateRandomColour = () => Math.floor(Math.random() * 16777215).toString(16);

const mockData = {
  title: 'All (HP:0000001)',
  color: 'white',
  children: [
    {
      color: generateRandomColour(),
      title: 'Phenotypic abnormality (HP:0000118)',
      size: 492,
      children: [
        {
          color: generateRandomColour(),
          title: 'Abnormality of the nervous system (HP:0000707)',
          size: 420,
          children: [
            {
              title: 'Abnormality of nervous system morphology (HP:0012639)',
              color: generateRandomColour(),
              size: 121,
              children: [
                {
                  title: 'Morphological abnormality of the central nervous system (HP:0002011)',
                  color: generateRandomColour(),
                  size: 121,
                  children: [
                    {
                      title: 'Abnormality of the cerebrospinal fluid (HP:0002921)',
                      color: generateRandomColour(),
                      size: 121,
                      children: [
                        {
                          title: 'Hydrocephalus (HP:0000238)',
                          color: generateRandomColour(),
                          size: 121,
                        },
                      ],
                    },
                    {
                      title: 'Abnormality of brain morphology (HP:0012443)',
                      color: generateRandomColour(),
                      size: 121,
                      children: [
                        {
                          title: 'Abnormality of the cerebral ventricles (HP:0002118)',
                          color: generateRandomColour(),
                          size: 121,
                          children: [
                            {
                              title: 'Hydrocephalus (HP:0000238)',
                              color: generateRandomColour(),
                              size: 121,
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              color: generateRandomColour(),
              title: 'Abnormality of nervous system physiology (HP:0012638)',
              size: 353,
              children: [
                {
                  color: generateRandomColour(),
                  title: 'Neurodevelopmental abnormality (HP:0012759)',
                  size: 46,
                  children: [
                    {
                      color: generateRandomColour(),
                      title: 'Neurodevelopmental delay (HP:0012758)',
                      size: 46,
                      children: [
                        {
                          //   color: '#5287AC',
                          title: 'Global developmental delay (HP:0001263)',
                          size: 46,
                        },
                      ],
                    },
                  ],
                },
                {
                  color: generateRandomColour(),
                  title: 'Seizures (HP:0001250)',
                  size: 152,
                },
                {
                  color: generateRandomColour(),
                  title: 'Behavioral abnormality (HP:0000708)',
                  size: 19,
                  children: [
                    {
                      color: generateRandomColour(),
                      title: 'Autistic behavior (HP:0000729)',
                      size: 19,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          color: generateRandomColour(),
          title: 'Abnormality of the eye (HP:0000478)',
          size: 134,
          children: [
            {
              color: generateRandomColour(),
              title: 'Abnormal eye physiology (HP:0012373)',
              size: 134,
              children: [
                {
                  color: generateRandomColour(),
                  title: 'Abnormality of vision (HP:0000504)',
                  size: 134,
                  children: [
                    {
                      color: generateRandomColour(),
                      title: 'Visual impairment (HP:0000505)',
                      size: 134,
                      children: [
                        {
                          color: generateRandomColour(),
                          title: 'Reduced visual acuity (HP:0007663)',
                          size: 134,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

const TOTAL_OF_PARTICIPANTS = 492;

export const Sunburst = () => {
  const [hoverCell, setHoverCell] = useState(null);

  const showTitleWhenHovered = hoverCell?.title;

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <SunburstVis
        animation={false}
        colorType="literal"
        data={mockData}
        width={275}
        height={275}
        padAngle={() => 0.04}
        onValueMouseOver={cell => {
          setHoverCell(cell);
        }}
        onSeriesMouseOut={() => {
          setHoverCell(null);
        }}
      >
        {showTitleWhenHovered && (
          <Hint value={hoverCell} style={{ backgroundColor: 'rgba(232, 236, 241, 0.6)' }}>
            <div
              style={{
                color: '#404c9a',
                textAlign: 'center',
              }}
            >
              {`${hoverCell.title}`} <br />
              {`n=${hoverCell.size || TOTAL_OF_PARTICIPANTS}`}
            </div>
          </Hint>
        )}
      </SunburstVis>
    </div>
  );
};
