import React, { ReactNode } from "react";
import { Popover, PopoverProps, Space, Typography } from "antd";
import DragHandle from "@ferlab/ui/core/layout/SortableGrid/DragHandle";
import { HolderOutlined, InfoCircleOutlined } from "@ant-design/icons";
import cx from "classnames";

import styles from "./index.module.scss";

// TODO: Move this comoponent in ferlab with GridCard V2

interface OwnProps {
  id: string;
  title: string;
  infoPopover?: PopoverProps;
  extra?: ReactNode[];
  withHandle?: boolean;
}

const { Title } = Typography;

const CardHeader = ({
  id,
  title,
  extra = [],
  withHandle = false,
  infoPopover,
}: OwnProps) => (
  <Title level={4} className={styles.cardHeader}>
    <Space direction="horizontal" size={5} className={styles.title}>
      {withHandle && (
        <DragHandle id={id} className={styles.dragHandle}>
          <HolderOutlined />
        </DragHandle>
      )}{" "}
      {title}
      {infoPopover && (
        <Popover
          {...infoPopover}
          className={cx(styles.infoPopover, infoPopover.className)}
          overlayClassName={cx(
            styles.infoPopoverOverlay,
            infoPopover.overlayClassName
          )}
        >
          <InfoCircleOutlined className={styles.infoIcon} />
        </Popover>
      )}
    </Space>
    <div className={styles.extra}>{extra}</div>
  </Title>
);

export default CardHeader;
