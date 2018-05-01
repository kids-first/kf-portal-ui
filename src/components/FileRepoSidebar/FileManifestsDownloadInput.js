import React, { Fragment } from 'react';
import { Trans } from 'react-i18next';
import Spinner from 'react-spinkit';
import { isEqual } from 'lodash';
import { css } from 'emotion';

import downloadIcon from 'assets/icon-download-white.svg';
import IconWithLoading from 'icons/IconWithLoading';
import Tooltip from 'uikit/Tooltip';

import { PillInputWithButton } from 'uikit/PillInputWithButton';
import Select, {
  SelectOptionDropdown,
  optionDropdownWrapperClassName,
  DropDownOption,
} from 'uikit/Select';

import ParticipantManifestModal from '../ParticipantManifestModal';
import FamilyManifestModal, { generateFamilyManifestModalProps } from '../FamilyManifestModal';

const spinner = (
  <Spinner
    fadeIn="none"
    name="circle"
    color="#a9adc0"
    style={{
      width: 20,
      height: 20,
      margin: 'auto',
      marginBottom: 20,
    }}
  />
);

export default class FileManifestsDownloadInput extends React.Component {
  state = {
    familyManifestModalProps: {},
    isLoading: false,
    isDropdownOpen: false,
    selectedDropdownOption: null,
  };
  componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps, this.props)) {
      this.setState({
        isDropdownOpen: false,
        selectedDropdownOption: null,
      });
    }
  }
  render() {
    const { api, sqon, index, projectId, theme, effects, columns } = this.props;
    const {
      familyManifestModalProps,
      isLoading,
      isDropdownOpen,
      selectedDropdownOption,
    } = this.state;
    const options = {
      'Participant only': () =>
        effects.setModal({
          title: 'Download Manifest',
          component: (
            <ParticipantManifestModal
              {...{
                api,
                sqon,
                index,
                projectId,
                columns,
              }}
            />
          ),
        }),
      'Participant and family': () =>
        effects.setModal({
          title: 'Download Manifest (Participant and Family)',
          component: (
            <FamilyManifestModal
              {...{
                ...familyManifestModalProps,
                api,
                sqon,
                index,
                projectId,
                columns,
              }}
            />
          ),
        }),
    };
    const hasNoFamilyFile = !(familyManifestModalProps.dataTypes || []).length;
    return (
      <div
        css={`
          display: flex;
          margin-bottom: 13px;
        `}
      >
        <PillInputWithButton
          selected={selectedDropdownOption || Object.keys(options)[0]}
          options={options}
          onOptionSelect={({ selected }) => {
            this.setState({ isDropdownOpen: false });
            options[selected]();
          }}
          SelectComponent={selectProps => {
            return (
              <Select
                {...selectProps}
                isOpen={isDropdownOpen}
                highlightedIndex={null}
                items={Object.keys(options)}
                defaultSelectedItem="Participant only"
                onToggle={() => {
                  this.setState({ isDropdownOpen: !isDropdownOpen }, async () => {
                    if (!isDropdownOpen) {
                      this.setState({ isLoading: true });
                      const familyManifestModalProps = await generateFamilyManifestModalProps({
                        api,
                        projectId,
                        sqon,
                      });
                      this.setState({ familyManifestModalProps, isLoading: false });
                    }
                  });
                }}
                OptionDropdownComponent={dropDownProps => {
                  return isLoading ? (
                    <div
                      {...dropDownProps}
                      className={`
                        ${optionDropdownWrapperClassName}
                        ${css`
                          right: 0px;
                        `}
                      `}
                    >
                      {spinner}
                    </div>
                  ) : (
                    <SelectOptionDropdown
                      {...{
                        ...dropDownProps,
                        selectItem: item => this.setState({ selectedDropdownOption: item }),
                        isItemDisabled: ({ item }) =>
                          item === 'Participant and family' && hasNoFamilyFile,
                        DropDownOptionComponent: ({ item, ...optionProps }) => (
                          <Fragment>
                            <DropDownOption {...{ ...optionProps, item }} />
                            {item === 'Participant and family' && hasNoFamilyFile ? (
                              <Tooltip
                                open={hasNoFamilyFile}
                                position="bottom"
                                html={<div>There is no family member files found</div>}
                              />
                            ) : null}
                          </Fragment>
                        ),
                      }}
                    />
                  );
                }}
              />
            );
          }}
          render={({ loading }) => {
            return (
              <Fragment>
                <IconWithLoading {...{ loading, icon: downloadIcon }} />
                <Trans css={theme.uppercase}>Download</Trans>
              </Fragment>
            );
          }}
        />
      </div>
    );
  }
}
