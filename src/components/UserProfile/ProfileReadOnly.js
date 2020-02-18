import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Card, Col, Divider, Row, Typography, Button } from 'antd';
import ResearchInterest from './ResearchInterests';
import {
  bioMsgWhenEmpty,
  storyMsgWhenEmpty,
  EDIT_CARD_TO_ADD_DETAILS,
} from 'components/UserProfile/constants';
import './style.css';
import { makeCommonCardPropsReadOnly, showWhenHasDataOrCanEdit } from './utils';
import { isFeatureEnabled } from 'common/featuresToggles';
import ReportMemberDlg from './ReportMemberDlg';

const hasInterests = data => Array.isArray(data.interests) && data.interests.length > 0;

const hasData = data => {
  return Boolean(data.bio) || Boolean(data.story) || hasInterests(data);
};

const showReportMemberButton = isLoggedUserViewingOtherPage =>
  !isLoggedUserViewingOtherPage && isFeatureEnabled('reportMember');

const { Text, Paragraph } = Typography;

export default class ProfileReadOnly extends React.Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    canEdit: PropTypes.bool.isRequired,
    onClickEditCb: PropTypes.func.isRequired,
    isProfileUpdating: PropTypes.bool.isRequired,
    loggedInUser: PropTypes.object.isRequired,
  };

  state = {
    showDlg: false,
  };

  onClickReportMember = () => {
    this.setState({
      showDlg: true,
    });
  };

  onClickCancelCB = () => {
    this.setState({
      showDlg: false,
    });
  };

  onClickOkCB = () => {
    this.setState({
      showDlg: false,
    });
  };

  addReportButtonToCardProps = cardProps => {
    const oldExtra = cardProps.extra;
    return {
      ...cardProps,
      extra: (
        <Fragment>
          {oldExtra}
          <Button
            size={'small'}
            icon="exclamation-circle"
            style={{ color: 'rgb(144, 38, 142)' }}
            type="link"
            ghost
            onClick={this.onClickReportMember}
          >
            Report Member
          </Button>
        </Fragment>
      ),
    };
  };

  render() {
    const { data, canEdit, onClickEditCb, isProfileUpdating, loggedInUser } = this.props;

    const baseCardProps = makeCommonCardPropsReadOnly({
      isProfileUpdating,
      title: 'Profile',
      onClickEditCb,
      canEdit,
    });

    if (!hasData(data)) {
      return (
        <Card {...baseCardProps}>
          <Text className={'contact-info-value'}>
            {canEdit ? EDIT_CARD_TO_ADD_DETAILS : 'No Data'}
          </Text>
        </Card>
      );
    }

    const hasInterestBlock = hasInterests(data) || canEdit;

    const enhancedCardProps = showReportMemberButton(canEdit)
      ? this.addReportButtonToCardProps(baseCardProps)
      : baseCardProps;

    const { showDlg } = this.state;

    return (
      <Fragment>
        {showDlg && (
          <ReportMemberDlg
            onClickCancelCB={this.onClickCancelCB}
            onClickOkCB={this.onClickOkCB}
            /* Both ids must be different for this part of the code runs only when loggedIn user reads someone's else profile.*/
            userReportingId={loggedInUser._id}
            userBlamedId={data._id}
          />
        )}
        <Card {...enhancedCardProps}>
          {showWhenHasDataOrCanEdit(data.bio, canEdit) && (
            <Row>
              <Col span={24}>
                <Text className={'section-text'}>My Bio</Text>
                <br />
                <Paragraph className={Boolean(data.bio) ? 'bio-story' : 'bio-story-when-empty'}>
                  {data.bio || bioMsgWhenEmpty}
                </Paragraph>
                {(hasInterestBlock || showWhenHasDataOrCanEdit(data.story, canEdit)) && (
                  <Divider className={'profile-divider'} />
                )}
              </Col>
            </Row>
          )}
          {showWhenHasDataOrCanEdit(data.story, canEdit) && (
            <Row>
              <Col span={24}>
                <Text className={'section-text'}>My Story</Text>
                <br />
                <Paragraph className={Boolean(data.story) ? 'bio-story' : 'bio-story-when-empty'}>
                  {data.story || storyMsgWhenEmpty}
                </Paragraph>
                {hasInterestBlock && <Divider className={'profile-divider'} />}
              </Col>
            </Row>
          )}
          {hasInterestBlock && (
            <Row>
              <Col span={24}>
                <Text className={'section-text'}>Research Interests</Text>
                <br />
                {hasInterests(data) ? (
                  <ResearchInterest interests={data.interests} />
                ) : (
                  <Text className={'text-when-no-interests'}>{'click edit to add interests '}</Text>
                )}
              </Col>
            </Row>
          )}
        </Card>
      </Fragment>
    );
  }
}
