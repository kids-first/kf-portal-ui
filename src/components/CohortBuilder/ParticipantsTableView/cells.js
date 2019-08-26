import React from 'react';
import { compose, withState } from 'recompose';
import { css } from 'emotion';
import { withTheme } from 'emotion-theming';
import FileIcon from 'icons/FileIcon';
import { Link } from 'uikit/Core';
import { union, compact } from 'lodash';
import { MONDOLink } from '../../Utils/DiagnosisAndPhenotypeLinks';
import { rowCss } from './css';

const SelectionCell = ({ value: checked, onCellSelected, row }) => {
  return (
    <input
      type="checkbox"
      checked={!!checked}
      onChange={
        row
          ? () => onCellSelected(!checked, row)
          : evt => {
              onCellSelected(evt.currentTarget.checked);
            }
      }
    />
  );
};

const isMondo = datum => typeof datum === 'string' && datum.includes('MONDO');

const enhance = compose(withState('collapsed', 'setCollapsed', true));

const CollapsibleMultiLineCell = enhance(({ value: data, collapsed, setCollapsed }) => {
  // Display one row when there is exactly more than one row.
  // Collapsing a single don't save any space.
  const cleanedUniquifiedData = compact(union(data));

  const sizeOfCleanData = cleanedUniquifiedData.length;

  const displayedRowCount = collapsed ? 1 : sizeOfCleanData;
  const displayMoreButton = sizeOfCleanData > 1;
  const hasManyValues = sizeOfCleanData > 1;

  return (
    <div className={`${rowCss}`}>
      <div style={{ display: 'flex', flexDirection: 'column', flex: '4' }}>
        {cleanedUniquifiedData.slice(0, displayedRowCount).map((datum, index) => {
          if (isMondo(datum)) {
            return <MONDOLink key={index} mondo={datum} />;
          } else {
            return (
              <div key={index}>
                {hasManyValues && '\u2022'}
                {datum &&
                  '\u00A0' /* unbreakable space to avoid empty rows from collapsing in height */}
              </div>
            );
          }
        })}
      </div>
      {displayMoreButton && (
        <div
          style={{ flex: '1', marginTop: '-8px ' }}
          onClick={() => {
            setCollapsed(!collapsed);
          }}
        >
          <div className={`showMore-wrapper ${collapsed ? 'more' : 'less'}`}>
            {collapsed ? `${sizeOfCleanData - displayedRowCount} ` : ''}
          </div>
        </div>
      )}
    </div>
  );
});

const NbFilesCell = compose(
  withTheme(({ value: nbFiles, row, theme }) => {
    const encodedSqon = encodeURI(
      JSON.stringify(
        {
          op: 'and',
          content: [
            {
              op: 'in',
              content: {
                field: 'participants.kf_id',
                value: [row.participantId],
              },
            },
          ],
        },
        null,
        0,
      ),
    );

    return (
      <Link to={`/search/file?sqon=${encodedSqon}`} className="nbFilesLink">
        <FileIcon
          className={css`
            margin-right: 5px;
          `}
          width={8}
          height={13}
          fill={theme.greyScale11}
        />
        {`${nbFiles} Files`}
      </Link>
    );
  }),
);

export { SelectionCell, CollapsibleMultiLineCell, NbFilesCell };
