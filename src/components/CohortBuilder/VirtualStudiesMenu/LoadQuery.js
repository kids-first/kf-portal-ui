import React from 'react';
import Tooltip from 'uikit/Tooltip';
import { styleComponent } from 'components/Utils';
import { Button } from 'antd';
import '../../LoadShareSaveDeleteQuery/LoadShareSaveDeleteQuery.css';
import { FolderOpenOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

const ItemRow = styleComponent('div', 'query-item-row');

export default class LoadQuery extends React.Component {
  static propTypes = {
    handleOpen: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    studies: PropTypes.array.isRequired,
    selection: PropTypes.object,
    classNameBtn: PropTypes.string,
  };

  state = { loaded: false, error: null, open: false, studies: [] };

  open = async (id) => {
    const { handleOpen } = this.props;
    try {
      this.setState({ open: false });
      handleOpen(id);
    } catch (error) {
      this.setState({ error: true });
    }
  };

  render() {
    const { disabled, studies, selection, classNameBtn } = this.props;
    return (
      <Button
        disabled={disabled}
        onClick={() => this.setState({ open: true })}
        className={classNameBtn}
        icon={<FolderOpenOutlined />}
      >
        <Tooltip
          position="bottom"
          open={this.state.open}
          onRequestClose={() => {
            this.setState({ open: false });
          }}
          interactive
          html={
            <div style={{ width: '200px' }}>
              <React.Fragment>
                {studies.map(({ virtualStudyId, name }) => {
                  if (!selection || selection.virtualStudyId !== virtualStudyId) {
                    return (
                      <ItemRow
                        onClick={() => this.open(virtualStudyId)}
                        key={`vitual-study-listitem_${virtualStudyId}`}
                      >
                        {name}
                      </ItemRow>
                    );
                  }
                  return null;
                })}
              </React.Fragment>
            </div>
          }
        >
          &nbsp;open
        </Tooltip>
      </Button>
    );
  }
}
