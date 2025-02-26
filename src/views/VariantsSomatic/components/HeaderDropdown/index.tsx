import intl from 'react-intl-universal';
import { useNavigate } from 'react-router';
import { DownOutlined } from '@ant-design/icons';
import { Button, Dropdown } from 'antd';

import { STATIC_ROUTES } from 'utils/routes';

interface Props {
  pageName: string;
}

const HeaderDropdown = ({ pageName }: Props) => {
  const navigate = useNavigate();
  return (
    <Dropdown
      menu={{
        items: [
          {
            key: 'germline',
            label: intl.get('layout.main.menu.germline'),
            onClick: () => navigate(STATIC_ROUTES.VARIANTS),
          },
          {
            key: 'somatic',
            label: intl.get('layout.main.menu.somatic'),
            onClick: () => navigate(STATIC_ROUTES.VARIANTS_SOMATIC),
          },
        ],
      }}
      trigger={['click']}
    >
      <Button onClick={(e) => e.preventDefault()} size="small">
        {pageName}
        <DownOutlined />
      </Button>
    </Dropdown>
  );
};

export default HeaderDropdown;
