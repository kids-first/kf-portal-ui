import React from 'react';
import { withRouter } from 'react-router-dom';
import { SaveOutlined } from '@ant-design/icons';
import { Button, Modal, notification } from 'antd';
import { Input, Typography } from 'antd';
import PropTypes from 'prop-types';

import sqonToName from 'common/sqonToName';
import { TRACKING_EVENTS, trackUserInteraction } from 'services/analyticsTracking';

import shortenApi from './shortenApi';

import './LoadShareSaveDeleteQuery.css';

const { Text } = Typography;

class SaveQuery extends React.Component {
  state = {
    loading: false,
    queryName: sqonToName({ filters: this.props.sqon }),
    open: false,
    openModal: false,
  };

  static propTypes = {
    stats: PropTypes.object,
    user: PropTypes.object,
    disabled: PropTypes.bool,
    sqon: PropTypes.object,
    api: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
  };

  componentDidUpdate(prevProps) {
    const { sqon } = this.props;
    if (prevProps.sqon !== sqon) {
      this.setState({ queryName: sqonToName({ filters: sqon }) });
    }
  }

  onCloseModal = () => this.setState({ openModal: false, loading: false });

  onOpenModal = () => this.setState({ openModal: true });

  save = async () => {
    const { stats, sqon, api, user, history } = this.props;
    const { queryName } = this.state;

    this.setState({ loading: true });
    try {
      const data = await shortenApi({
        stats,
        sqon,
        queryName,
        user,
        api,
        sharedPublicly: false,
      });

      await trackUserInteraction({
        category: TRACKING_EVENTS.categories.fileRepo.dataTable,
        action: TRACKING_EVENTS.actions.query.save,
        label: JSON.stringify({ ...sqon, id: data.id }),
      });

      notification.success({
        key: 'view_in_my_saved_queries',
        message: 'Query saved succesfully!',
        description: (
          <div>
            <Button
              type={'link'}
              onClick={async () => {
                await trackUserInteraction({
                  category: TRACKING_EVENTS.categories.fileRepo.dataTable,
                  action: 'View in My Saved Queries',
                });
                notification.close('view_in_my_saved_queries');
                history.push('/dashboard');
              }}
            >
              View in My Saved Queries
            </Button>
          </div>
        ),
        duration: 5,
      });
      this.onCloseModal();
    } catch (e) {
      await trackUserInteraction({
        category: TRACKING_EVENTS.categories.fileRepo.dataTable,
        action: TRACKING_EVENTS.actions.query.save + ' FAILED',
      });

      this.onCloseModal();
      console.error(e);
      notification.error({
        message: 'Error',
        description:
          'An error occured while trying to save your query. Please, try again or contact our support',
        duration: 5,
      });
    } finally {
      this.setState({ loading: false });
    }
  };

  onChange = (e) => this.setState({ queryName: e.target.value });

  render() {
    const { disabled, user } = this.props;
    const { openModal, loading, queryName } = this.state;

    if (!user) {
      return null;
    }

    return (
      <>
        <Modal
          visible={openModal}
          title={'Save Query'}
          onCancel={this.onCloseModal}
          footer={[
            <Button key="cancel" onClick={this.onCloseModal}>
              Cancel
            </Button>,
            <Button
              key="save"
              type="primary"
              maxLength={300}
              disabled={disabled || !queryName}
              loading={loading}
              onClick={this.save}
            >
              Save
            </Button>,
          ]}
        >
          <Text>Save the current configuration of filters</Text>
          <Input
            value={queryName}
            placeholder="Enter a name for your saved query"
            onChange={this.onChange}
          />
        </Modal>
        <Button icon={<SaveOutlined />} disabled={disabled} onClick={this.onOpenModal}>
          Save
        </Button>
      </>
    );
  }
}

export default withRouter(SaveQuery);
