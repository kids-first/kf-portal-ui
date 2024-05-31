import { useDispatch } from 'react-redux';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import GridCard from '@ferlab/ui/core/view/v2/GridCard';
import { Button, Modal, Typography } from 'antd';

import { deleteUser } from 'store/user/thunks';

const { Text, Title } = Typography;
const { confirm } = Modal;

const DeleteCard = () => {
  const dispatch = useDispatch();

  const showConfirm = () => {
    confirm({
      title: 'Delete account',
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure you want to permanently delete this account?',
      okText: 'Delete',
      cancelText: 'Cancel',
      okButtonProps: {
        danger: true,
        type: 'primary',
      },
      onOk: () => dispatch(deleteUser()),
    });
  };

  return (
    <GridCard
      title={<Title level={4}>Delete Account</Title>}
      footer={
        <Button type="primary" danger onClick={showConfirm}>
          Delete my account
        </Button>
      }
      content={
        <Text>
          You will no longer be able to sign into the Kids First data portal. All of your saved sets
          and queries will be lost. You can create a new account at any time.
        </Text>
      }
    />
  );
};

export default DeleteCard;
