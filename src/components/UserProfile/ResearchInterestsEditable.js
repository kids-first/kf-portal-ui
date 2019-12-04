import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col, Row, Tag, Select, Form, AutoComplete, Icon, Input } from 'antd';
import { toKebabCase } from 'utils';
import { DISEASE_AREAS, STUDY_SHORT_NAMES } from 'common/constants';
import { debounce, difference } from 'lodash';
import { compose } from 'recompose';
import { withApi } from 'services/api';
import { getTags } from 'services/profiles';

const { Option } = Select;

const MIN_NUM_OF_CHAR_TO_CHECK = 2;

const generateFieldNameFromInterest = interest => toKebabCase(`tag ${interest}`);

const generateStyleForOtherInterestIcon = input => {
  if (input && input.length >= MIN_NUM_OF_CHAR_TO_CHECK) {
    return {
      color: 'green',
    };
  }
  return null;
};

// Let's inject tags into the form so we can have access to them in the parent.
class ResearchInterestsEditable extends Component {
  static propTypes = {
    initialInterest: PropTypes.arrayOf(PropTypes.string).isRequired,
    parentForm: PropTypes.object.isRequired,
    api: PropTypes.func.isRequired,
  };

  static defaultProps = {
    initialInterest: [],
  };

  state = {
    interests: [...this.props.initialInterest],
    dataSource: [],
    errorFetchingTags: null,
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

  componentDidUpdate(prevProps, prevState) {
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
              <Tag
                key={toKebabCase(`${index} ${interest}`)}
                closable
                onClose={this.onDeleteInterest(interest)}
              >
                {interest}
              </Tag>,
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
    const { api } = this.props;
    const { interests } = this.state;

    try {
      const suggestions = await getTags(api)({ filter, size: 5 });
      const loweredSuggestions = [...new Set(suggestions.values.map(x => x.value.toLowerCase()))];
      const uniqueSuggestions = difference(loweredSuggestions, interests);
      this.setState({ dataSource: uniqueSuggestions });
    } catch (e) {
      //FIXME when backend is fixed add error management by adding this line =>this.setState({ errorFetchingTags: e });
    }
  }, 200);

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

    const { dataSource, errorFetchingTags } = this.state;

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
              label="Other areas of interests"
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
                <AutoComplete dataSource={dataSource} onSearch={this.onSearch}>
                  <Input
                    onPressEnter={this.onPressEnter}
                    placeholder="Search for interests"
                    prefix={<Icon type="search" />}
                    suffix={
                      <Icon
                        type="check"
                        onClick={this.onClickCheck}
                        style={generateStyleForOtherInterestIcon(autoCompleteCurrentValue)}
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

export default compose(withApi)(ResearchInterestsEditable);
