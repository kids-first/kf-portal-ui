import React from 'react';
import UserProfilePageBox from 'components/UserProfile/UserProfilePageBox';
import { Select, Tag, Typography } from 'antd';
import BasicInfoForm from 'components/forms/BasicInfoForm';
import { xor } from 'lodash';
import InterestsAutocomplete from 'components/UserProfile/InterestsAutocomplete';
import { DISEASE_AREAS, STUDY_SHORT_NAMES } from 'common/constants';

const { Title } = Typography;
const { Option } = Select;

class UserProfilePageResearchInterests extends React.Component {
  state = {
    isEditingBackgroundInfo: false,
    interests: [],
  };

  componentDidMount() {
    this.setState({interests: this.props.interests})
  }

  onCancel = () => {
    this.setState({ isEditingBackgroundInfo: false, interests: this.props.interests });
  };

  onEditClick = () => {
    this.setState({ isEditingBackgroundInfo: !this.state.isEditingBackgroundInfo });
  };

  handleSave = () => {
    this.props.onSave({
      interests: this.state.interests,
    });
    this.setState({isEditingBackgroundInfo: false})
  };

  handleClick = (interests, x) => (e) => {
    console.log(interests, x, 'Click');
    this.setState({interests: xor(interests, [x]) }, () => console.log(this.state, 'stateAFTER'));
  };


  render() {
    const { interests, isEditingBackgroundInfo } = this.state;
    console.log(interests, 'render');

    return (
      <UserProfilePageBox
        title={'Research Interests'}
        onSave={this.handleSave}
        onCancel={this.onCancel}
        onEditClick={this.onEditClick}
        isEditingBackgroundInfo={isEditingBackgroundInfo}
        canEdit={this.props.canEdit}
      >
        {!interests.length && (
          <Title level={4}>
            Please specify Kids First studies, diseases and other areas that interest you.
          </Title>
        )}

        <div>
          {interests.map((x, i) => (
            <Tag
              key={i+x+''}
              closable={isEditingBackgroundInfo}
              onClose={isEditingBackgroundInfo && this.handleClick(interests, x) }
            >
              {x}
            </Tag>
          ))}
        </div>

        {isEditingBackgroundInfo && (
          <React.Fragment>
            <div>
              <div>Kids First Disease Areas:</div>
              <Select
                onChange={e => {
                   this.setState([...interests, e.target.value.toLowerCase()]);
                }}
                value=""
              >
                <Option value="" disabled selected>
                  -- Select an option --
                </Option>
                {DISEASE_AREAS.filter(area => !interests.includes(area.toLowerCase())).map(area => (
                  <Option value={area} key={area}>
                    {area}
                  </Option>
                ))}
              </Select>
            {/*  <div>Kids First Studies:</div>*/}
            {/*  <Select*/}
            {/*    onChange={e => {*/}
            {/*      this.setState([...interests, e.target.value.toLowerCase()]);*/}
            {/*    }}*/}
            {/*    value=""*/}
            {/*  >*/}
            {/*    <Option value="" disabled selected>*/}
            {/*      -- Select an option --*/}
            {/*    </Option>*/}
            {/*    {STUDY_SHORT_NAMES.filter(study => !interests.includes(study.toLowerCase())).map(*/}
            {/*      study => (*/}
            {/*        <Option value={study} key={study}>*/}
            {/*          {study}*/}
            {/*        </Option>*/}
            {/*      ),*/}
            {/*    )}*/}
            {/*    >*/}
            {/*  </Select>*/}
            {/*  <div>Other areas of interest:</div>*/}
            {/*  /!*<InterestsAutocomplete {...{ interests, setInterests }} />*!/*/}
            {/*  /!*fixme*!/*/}
            </div>

            {/*<ActionButtons*/}
            {/*  {...{ handleEditingResearchInterests, setInterests, submit, profile, interests }}*/}
            {/*/>*/}
          </React.Fragment>
        )}
      </UserProfilePageBox>
    );
  }
}

export default UserProfilePageResearchInterests;
