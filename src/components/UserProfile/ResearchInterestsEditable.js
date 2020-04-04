import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { CheckOutlined, SearchOutlined, CloseCircleTwoTone } from '@ant-design/icons';
import { Col, Row, Tag, Select, AutoComplete, Input, Button, Form } from 'antd';
import { toKebabCase } from 'utils';
import { DISEASE_AREAS, STUDY_SHORT_NAMES } from 'common/constants';
import { debounce } from 'lodash';
import './style.css';
import { searchInterests } from 'services/members/search';

const { Option } = Select;

const MIN_NUM_OF_CHAR_TO_CHECK = 2;
const WAIT_IN_MS = 500;
const MAX_LENGTH_FOR_INTEREST = 60;

const STYLE_NO_BORDER = { border: 'none' };

const TAG_ICON_STYLE = {
  paddingLeft: '10px',
  paddingRight: '10px',
  paddingBottom: '5px',
};

const generateFieldNameFromInterest = interest => toKebabCase(`tag ${interest}`);

const generateClassNameForOtherInterestIcon = input => {
  if (input && input.length >= MIN_NUM_OF_CHAR_TO_CHECK) {
    return 'ri-check-icon';
  }
  return '';
};

const setFieldForEveryInterests = (interests = [], form) => {
  //Inject dynamically tags into the form
  interests.forEach(interest => {
    const fieldNameForTag = generateFieldNameFromInterest(interest);
    form.setFieldsValue({ [fieldNameForTag]: interest });
  });
};

const shapeSuggestionsAsOptions = suggestions => suggestions.map(s => ({ value: s }));

// Let's inject tags into the form so we can have access to them in the parent.
const ResearchInterestsEditable = props => {
  const { parentForm, charactersLengthValidator, initialInterests } = props;

  const { resetFields } = parentForm;

  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [errorFetchingTags, setErrorFetchingTags] = useState(null);
  const [dataSource, setDataSource] = useState([]);
  const [interests, setInterests] = useState(initialInterests || []);

  useEffect(() => {
    setFieldForEveryInterests(interests, parentForm);
    // code to run on component mount
  });

  const generateTags = () =>
    interests.map((interest, index) => {
      const interestName = generateFieldNameFromInterest(interest);
      return (
        <Row key={`${index}-${interestName}`}>
          <Form.Item name={interestName} rules={[{ required: false }]}>
            <Fragment>
              <Tag className={'ri-tag'} key={toKebabCase(`${index} ${interest}`)}>
                <div className={'ri-tag-content'}>
                  <div className={'ri-text-wrapper'}>{interest}</div>
                  <div>
                    <Button
                      size={'small'}
                      shape={'circle'}
                      style={STYLE_NO_BORDER}
                      type={'ghost'}
                      onClick={() => {
                        const interestFiltered = interests.filter(i => i !== interest);

                        resetFields([interestName]); //clean form, for it was added dynamically.

                        setInterests(interestFiltered);
                      }}
                      icon={<CloseCircleTwoTone style={TAG_ICON_STYLE} twoToneColor="#90268E" />}
                    />
                  </div>
                </div>
              </Tag>
            </Fragment>
          </Form.Item>
        </Row>
      );
    });

  const handleSelectChange = value => {
    const cleanedValue = value.toLowerCase();
    setInterests([cleanedValue, ...interests]);
  };

  const generateOptions = arrToFilter =>
    arrToFilter
      .filter(area => !interests.includes(area.toLowerCase()))
      .map(area => (
        <Option value={area} key={toKebabCase(area)}>
          {area}
        </Option>
      ));

  const getSuggestions = debounce(async filter => {
    try {
      setIsLoadingSuggestions(true);

      const response = await searchInterests(filter);
      const loweredSuggestions = response.interests.map(i => i.toLowerCase());
      const suggestionsExceptExisting = loweredSuggestions.filter(sug => !interests.includes(sug));

      setDataSource(shapeSuggestionsAsOptions(suggestionsExceptExisting));

      setIsLoadingSuggestions(false);
    } catch (e) {
      setIsLoadingSuggestions(false);
      setErrorFetchingTags(e);
    }
  }, WAIT_IN_MS);

  const onClickCheck = () => {
    const error = parentForm.getFieldError('otherAreasOfInterests');
    const interestFromAutoComplete = parentForm.getFieldValue('otherAreasOfInterests');
    const hasNoError = !error || (Array.isArray(error) && error.length === 0);
    if (hasNoError && interestFromAutoComplete) {
      const cleanedInterest = interestFromAutoComplete.trim().toLowerCase();
      if (!interests.some(i => i === cleanedInterest)) {
        setInterests([cleanedInterest, ...interests]);
      }
    }
  };

  const autoCompleteCurrentValue = parentForm.getFieldsValue().otherAreasOfInterests || '';

  const errorOtherAreasOfInterests = parentForm.getFieldError('otherAreasOfInterests') || [];
  const helpInfo = [
    {
      isError: Boolean(errorOtherAreasOfInterests[0]),
      msg: errorOtherAreasOfInterests[0],
      mustCorrect: true,
    },
    {
      isError: Boolean(errorFetchingTags),
      msg: 'Unable to fetch suggestions but you can still add an interest',
      mustCorrect: false,
    },
  ].find(e => e.isError); // max character exceeded msg > broken api msg

  const mustCorrectError = Boolean(helpInfo) && helpInfo.mustCorrect; //disable clicking and green check

  return (
    <Row>
      <Col span={8}>
        <Form.Item
          name="diseaseArea"
          label={'Kids First Disease Areas'}
          rules={[{ required: false }]}
        >
          <Select placeholder="Select an option" onChange={handleSelectChange} size={'small'}>
            {generateOptions(DISEASE_AREAS)}
          </Select>
        </Form.Item>
        <Form.Item
          name="studyShortNames"
          label={'Kids First Studies'}
          rules={[{ required: false }]}
        >
          <Select placeholder="Select an option" onChange={handleSelectChange} size={'small'}>
            {generateOptions(STUDY_SHORT_NAMES)}
          </Select>
        </Form.Item>
        <Form.Item
          name={'otherAreasOfInterests'}
          label={'otherAreasOfInterests'}
          validateStatus={helpInfo ? 'error' : ''}
          help={helpInfo ? helpInfo.msg : ''}
          rules={[
            { required: false },
            () => ({
              validator: charactersLengthValidator(MAX_LENGTH_FOR_INTEREST),
            }),
          ]}
        >
          <AutoComplete
            options={isLoadingSuggestions ? [] : dataSource}
            onSearch={searchText => {
              if (!searchText || searchText.length < MIN_NUM_OF_CHAR_TO_CHECK) {
                return null;
              }
              getSuggestions(searchText);
            }}
          >
            <Input
              onPressEnter={e => {
                e.preventDefault();
                onClickCheck();
              }}
              placeholder="Search for interests"
              prefix={<SearchOutlined />}
              suffix={
                <Button
                  style={STYLE_NO_BORDER}
                  type={'ghost'}
                  onClick={onClickCheck}
                  icon={
                    <CheckOutlined
                      className={
                        mustCorrectError
                          ? ''
                          : generateClassNameForOtherInterestIcon(autoCompleteCurrentValue)
                      }
                    />
                  }
                />
              }
              size={'small'}
            />
          </AutoComplete>
        </Form.Item>
      </Col>
      <Col offset={4} span={12} style={{ paddingTop: '32px' }}>
        {generateTags()}
      </Col>
    </Row>
  );
};

ResearchInterestsEditable.propTypes = {
  initialInterests: PropTypes.arrayOf(PropTypes.string).isRequired,
  parentForm: PropTypes.object.isRequired,
  charactersLengthValidator: PropTypes.func.isRequired,
};

export default ResearchInterestsEditable;
