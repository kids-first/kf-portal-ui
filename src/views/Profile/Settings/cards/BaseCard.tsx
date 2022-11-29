import GridCard from '@ferlab/ui/core/view/v2/GridCard';
import { Button, FormInstance, Space, Typography } from 'antd';
import { PropsWithChildren, ReactElement } from 'react';

interface OwnProps {
  title?: string;
  customHeader?: ReactElement;
  form: FormInstance;
  isValueChanged: boolean;
  onDiscardChanges: () => void;
}

const { Title } = Typography;

const BaseCard = ({
  title,
  customHeader,
  isValueChanged,
  form,
  onDiscardChanges,
  children,
}: PropsWithChildren<OwnProps>) => {
  return (
    <GridCard
      title={<>{customHeader ? customHeader : <Title level={4}>{title}</Title>}</>}
      footer={
        <Space>
          <Button type="primary" disabled={!isValueChanged} onClick={form.submit}>
            Save changes
          </Button>
          {isValueChanged && (
            <Button type="text" onClick={onDiscardChanges}>
              Discard changes
            </Button>
          )}
        </Space>
      }
      content={children}
    />
  );
};

export default BaseCard;
