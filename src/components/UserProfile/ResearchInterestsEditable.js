import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Col, Row, Tag, Select, Form, AutoComplete, Icon, Input, Button } from 'antd';
import { toKebabCase } from 'utils';
import { DISEASE_AREAS, STUDY_SHORT_NAMES } from 'common/constants';
import { debounce } from 'lodash';
import './style.css';
import { searchInterests } from 'services/members/search';

const { Option } = Select;

const MIN_NUM_OF_CHAR_TO_CHECK = 2;
const WAIT_IN_MS = 500;

const generateFieldNameFromInterest = interest => toKebabCase(`tag ${interest}`);

const generateClassNameForOtherInterestIcon = input => {
  if (input && input.length >= MIN_NUM_OF_CHAR_TO_CHECK) {
    return 'ri-check-icon';
  }
  return '';
};

// Let's inject tags into the form so we can have access to them in the parent.
class ResearchInterestsEditable extends Component {
  static propTypes = {
    initialInterest: PropTypes.arrayOf(PropTypes.string).isRequired,
    parentForm: PropTypes.object.isRequired,
  };

  static defaultProps = {
    initialInterest: [],
  };

  state = {
    interests: [...this.props.initialInterest],
    dataSource: [],
    errorFetchingTags: null,
    isLoadingSuggestions: false,
  };

  setFieldForEveryInterests = (interests = []) => {
    const { parentForm } = this.props;
    //Inject dynamically tags into the form
    interests.forEach(interest => {
      const fieldNameForTag = generateFieldNameFromInterest(interest);
      parentForm.setFieldsValue({ [fieldNameForTag]: interest });
    });
  };

  componentDidMount() {
    const { interests } = this.state;
    //Inject dynamically initial tags into the form
    this.setFieldForEveryInterests(interests);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { interests } = this.state;
    // We can only add or remove so there is not need to check the content
    if (interests.length !== prevState.interests.length) {
      this.setFieldForEveryInterests(interests);
    }
  }

  onDeleteInterest = tag => () => {
    const { interests } = this.state;
    const interestFiltered = interests.filter(i => i !== tag);
    this.setState({ interests: interestFiltered });
  };

  generateTags = () => {
    const { interests } = this.state;
    const { parentForm } = this.props;
    const { getFieldDecorator } = parentForm;
    const formItemStyle = { margin: 0 };
    return interests.map((interest, index) => {
      return (
        <Row key={index}>
          <Form.Item style={formItemStyle}>
            {getFieldDecorator(generateFieldNameFromInterest(interest), {
              rules: [{ required: false }],
            })(
              <Fragment>
                <Tag className={'ri-tag'} key={toKebabCase(`${index} ${interest}`)}>
                  {interest}
                </Tag>
                <Button
                  size={'small'}
                  icon={'close'}
                  type="danger"
                  ghost
                  shape="circle"
                  onClick={this.onDeleteInterest(interest)}
                />
              </Fragment>,
            )}
          </Form.Item>
        </Row>
      );
    });
  };

  handleSelectChange = value => {
    const { interests } = this.state;
    const cleanedValue = value.toLowerCase();
    this.setState({ interests: [cleanedValue, ...interests] });
  };

  generateOptions = arrToFilter => {
    const { interests } = this.state;
    return arrToFilter
      .filter(area => !interests.includes(area.toLowerCase()))
      .map(area => (
        <Option value={area} key={toKebabCase(area)}>
          {area}
        </Option>
      ));
  };

  getSuggestions = debounce(async filter => {
    const { interests } = this.state;
    try {
      this.setState({ isLoadingSuggestions: true });

      const response = await searchInterests(filter);
      const loweredSuggestions = response.interests.map(i => i.toLowerCase());
      const suggestionsExceptExisting = loweredSuggestions.filter(sug => !interests.includes(sug));

      this.setState({ dataSource: suggestionsExceptExisting, isLoadingSuggestions: false });
    } catch (e) {
      this.setState({ errorFetchingTags: e, isLoadingSuggestions: false });
    }
  }, WAIT_IN_MS);

  onSearch = searchText => {
    if (!searchText || searchText.length < MIN_NUM_OF_CHAR_TO_CHECK) {
      return null;
    }
    this.getSuggestions(searchText);
  };

  onClickCheck = () => {
    const { parentForm } = this.props;
    const interestFromAutoComplete = parentForm.getFieldValue('otherAreasOfInterests');
    if (interestFromAutoComplete) {
      const cleanedInterest = interestFromAutoComplete.trim().toLowerCase();
      const { interests } = this.state;
      if (!interests.some(i => i === cleanedInterest)) {
        this.setState({ interests: [cleanedInterest, ...interests] });
      }
    }
  };

  onPressEnter = e => {
    e.preventDefault();
    this.onClickCheck();
  };

  render() {
    const { parentForm } = this.props;
    const { getFieldDecorator } = parentForm;

    const autoCompleteCurrentValue = parentForm.getFieldsValue().otherAreasOfInterests || '';

    const { dataSource, errorFetchingTags, isLoadingSuggestions } = this.state;

    return (
      <Row>
        <Col span={8}>
          <Row>
            <Form.Item label="Kids First Disease Areas">
              {getFieldDecorator('diseaseArea', {
                rules: [{ required: false }],
              })(
                <Select placeholder="Select an option" onChange={this.handleSelectChange}>
                  {this.generateOptions(DISEASE_AREAS)}
                </Select>,
              )}
            </Form.Item>
          </Row>
          <Row>
            <Form.Item label="Kids First Studies">
              {getFieldDecorator('studyShortNames', {
                rules: [{ required: false }],
              })(
                <Select placeholder="Select an option" onChange={this.handleSelectChange}>
                  {this.generateOptions(STUDY_SHORT_NAMES)}
                </Select>,
              )}
            </Form.Item>
          </Row>
          <Row>
            <Form.Item
              label="Other areas of interest"
              validateStatus={Boolean(errorFetchingTags) ? 'error' : ''}
              help={
                Boolean(errorFetchingTags)
                  ? 'Unable to fetch suggestions but you can still add an interest'
                  : ''
              }
            >
              {getFieldDecorator('otherAreasOfInterests', {
                rules: [{ required: false }],
              })(
                <AutoComplete
                  dataSource={isLoadingSuggestions ? [] : dataSource}
                  onSearch={this.onSearch}
                >
                  <Input
                    onPressEnter={this.onPressEnter}
                    placeholder="Search for interests"
                    prefix={<Icon type="search" />}
                    suffix={
                      <Icon
                        type="check"
                        onClick={this.onClickCheck}
                        className={generateClassNameForOtherInterestIcon(autoCompleteCurrentValue)}
                      />
                    }
                  />
                </AutoComplete>,
              )}
            </Form.Item>
          </Row>
        </Col>
        <Col offset={4} span={12} style={{ paddingTop: '32px' }}>
          {this.generateTags()}
        </Col>
      </Row>
    );
  }
}

export default ResearchInterestsEditable;
