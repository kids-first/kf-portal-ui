import { ApiOutlined } from "@ant-design/icons";
import { Button, ButtonProps, Space, Typography } from "antd";

import styles from "./index.module.scss";

interface OwnProps {
  icon: React.ReactElement;
  description: string;
  btnProps?: ButtonProps;
  btnText?: string;
}

const { Text } = Typography;

const CardConnectPlaceholder = ({
  icon,
  description,
  btnProps,
  btnText = "Connect",
}: OwnProps) => (
  <Space direction="vertical" className={styles.connectPlaceholder} size={16}>
    <div>
      <div className={styles.iconWrapper}>{icon}</div>
    </div>
    <Text className={styles.description}>{description}</Text>
    <Button
      type={btnProps?.type || "primary"}
      size={btnProps?.size || "small"}
      icon={btnProps?.icon || <ApiOutlined />}
      {...btnProps}
    >
      {btnText}
    </Button>
  </Space>
);

export default CardConnectPlaceholder;
