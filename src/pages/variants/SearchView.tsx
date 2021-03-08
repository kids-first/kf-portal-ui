import React, { FunctionComponent } from 'react';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';
import { AutoComplete, Form, Input } from 'antd';
import style from './SearchView.module.scss';
import VariantTable from './VariantTable';
import Empty, { SIZE } from '../../components/UI/Empty';
import { SearchOutlined } from '@ant-design/icons';

const DEBUG_SHOW_INIT_VIEW = false; // To be removed

const SearchView: FunctionComponent = () => (
  <StackLayout vertical className={style.searchViewContainer} center>
    <StackLayout vertical className={style.autoCompleteContainer} fitContent>
      <Form name={'variant'}>
        <Form.Item
          name="variant_search"
          help="Search examples: 11-2928377-A-G, rs282772, BRAF, BRAF V292G"
        >
          <AutoComplete
            className={style.inputVariant}
            style={{ width: style.autoCompleteWidth }}
            options={[]}
            notFoundContent={'No results found'}
          >
            <Input prefix={<SearchOutlined />} allowClear size="large" placeholder="Search..." />
          </AutoComplete>
        </Form.Item>
      </Form>
    </StackLayout>
    {DEBUG_SHOW_INIT_VIEW ? (
      <StackLayout vertical center className={style.initialSearchContainer}>
        <Empty size={SIZE.DEFAULT} description={'Use the search variant tool above'} />
      </StackLayout>
    ) : (
      <VariantTable />
    )}
  </StackLayout>
);

export default SearchView;
