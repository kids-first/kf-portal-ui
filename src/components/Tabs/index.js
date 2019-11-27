import React from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';

import Row from 'uikit/Row';
import { Span } from 'uikit/Core';

import './Tabs.css';

const Tab = ({ selected, children, onClick }) => (
  <Row className={`tabs-option ${selected ? 'active-tab' : ''}`} onClick={onClick}>
    {children}
  </Row>
);

export const ShowIf = ({ condition, children, className = '' }) => (
  <div className={className} style={{ display: condition ? 'block' : 'none' }}>
    {children}
  </div>
);

export default class Tabs extends React.Component {
  constructor(props) {
    super(props);
    const { initialSelectedTab, options } = props;
    const initialTab = options.find(opt => opt.id === initialSelectedTab) || options[0];
    this.state = {
      selectedTab: initialTab.id || initialTab.display,
    };
    this.onTabSelect = this.onTabSelect.bind(this);
  }

  static propTypes = {
    initialSelectedTab: PropTypes.string,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        display: PropTypes.string.isRequired,
        total: PropTypes.any,
      }),
    ).isRequired,
    onTabSelect: PropTypes.func,
  };

  static defaultProps = {
    onTabSelect: noop,
  };

  onTabSelect(id) {
    this.setState({ selectedTab: id });
    this.props.onTabSelect(id);
  }

  render() {
    const { options, children } = this.props;
    const { selectedTab } = this.state;

    return (
      <React.Fragment>
        <Row className="tabs-options" key="tabs-options">
          {options.map(({ display, id = display, total = null }) => (
            <Tab
              onClick={() => {
                this.onTabSelect(id);
              }}
              selected={selectedTab === id}
              key={id}
            >
              <Span>{display}</Span>
              {total !== null && <div className="tabs-option-badge">{total}</div>}
            </Tab>
          ))}
        </Row>
        {children && (
          <Row className="tabs-content-container" key="tabs-content-container">
            {children.map((child, index) => {
              const { display, id = display } = options[index];
              return (
                <ShowIf
                  key={id}
                  className="tabs-content-content"
                  condition={selectedTab === (id || display)}
                >
                  {child}
                </ShowIf>
              );
            })}
          </Row>
        )}
      </React.Fragment>
    );
  }
}
