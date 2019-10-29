import React from 'react';
import UserProfilePageBox from 'components/UserProfile/UserProfilePageBox';
import { Select, Typography } from 'antd';
import { xor } from 'lodash';
import { DISEASE_AREAS, STUDY_SHORT_NAMES } from 'common/constants';

const { Title } = Typography;
const { Option, OptGroup } = Select;

class UserProfilePageResearchInterests extends React.Component {
  state = {
    isEditingBackgroundInfo: false,
    interests: [],
  };

  componentDidMount() {
    this.setState({ interests: this.props.interests });
  }

  onCancel = () => {
    this.setState({ isEditingBackgroundInfo: false, interests: this.props.interests });
  };

  onEditClick = () => {
    this.setState({ isEditingBackgroundInfo: !this.state.isEditingBackgroundInfo });
  };

  handleSave = () => {
    console.log(this.state.interests, 'Save');
    this.props.onSave({
      interests: this.state.interests,
    });
    this.setState({ isEditingBackgroundInfo: false });
  };

  handleClick = (interests, x) => e => {
    this.setState({ interests: xor(interests, [x]) }, () => console.log(this.state, 'stateAFTER'));
  }; //TODO incorporate in handleChange

  handleChange = value => {
    this.setState({ interests: value.map(v => v.toLowerCase()) });
  };

  getDiseaseAreas = interests => {
    const childrenDiseaseArea = [];
    DISEASE_AREAS.filter(area => !interests.includes(area.toLowerCase())).map(area =>
      childrenDiseaseArea.push(
        <Option value={area} key={area}>
          {area}
        </Option>,
      ),
    );
    return childrenDiseaseArea;
  };

  getStudies = interests => {
    const childrenStudies = [];
    STUDY_SHORT_NAMES.filter(study => !interests.includes(study.toLowerCase())).map(study =>
      childrenStudies.push(
        <Option value={study} key={study}>
          {study}
        </Option>,
      ),
    );
    return childrenStudies;
  };

  render() {
    const { interests, isEditingBackgroundInfo } = this.state;

    return (
      <UserProfilePageBox
        title={'Research Interests'}
        onSave={this.handleSave}
        onCancel={this.onCancel}
        onEditClick={this.onEditClick}
        isEditingBackgroundInfo={isEditingBackgroundInfo}
        canEdit={this.props.canEdit}
      >
        {console.log(interests, 'interests @ render')}
        {!interests.length && (
          <Title level={4}>
            Please specify Kids First studies, diseases and other areas that interest you.
          </Title>
        )}

        <React.Fragment>
          <div>
            <Select
              mode="tags"
              style={{ width: '100%' }}
              onChange={this.handleChange}
              onSelect={this.onSelect}
              tokenSeparators={[',']}
              value={this.state.interests}
              disabled={!isEditingBackgroundInfo && this.props.canEdit}
            >
              <OptGroup label="Kids First Disease Areas:">
                {this.getDiseaseAreas(interests)}
              </OptGroup>
              <OptGroup label="Kids First Studies:">
                {this.getStudies(interests)}
              </OptGroup>
            </Select>
          </div>
        </React.Fragment>
      </UserProfilePageBox>
    );
  }
}

export default UserProfilePageResearchInterests;
