import React, { useEffect } from 'react';
import { VisualType } from '@ferlab/ui/core/components/filters/types';
import { ISqonGroupFilter } from '@ferlab/ui/core/components/QueryBuilder/types';
import { Select, Tag } from 'antd';

import history from 'services/history';

import { ItemProps } from './SidebarFilters';
import { updateFilters, useFilters } from './utils';

type OwnProps = {
  options: ItemProps[];
};

const extractCodesFromFilter = (filters: ISqonGroupFilter) => {
  const find = filters.content.find(
    (s: { content: { field: string } }) => s.content.field === 'code',
  );
  return find ? find.content.value : [];
};

const SearchBar = ({ options }: OwnProps) => {
  const [selected, setSelected] = React.useState<string[]>([]);

  const { filters } = useFilters();
  const selectedStudyCodes = extractCodesFromFilter(filters);

  useEffect(() => {
    if (selected.length != selectedStudyCodes.length) {
      const updateSelected = selected.filter((f) => selectedStudyCodes.includes(f.split('|')[0]));
      setSelected(updateSelected);
    }
  }, [filters, selected]);

  const handleClose = (value: string) => {
    const remainingSelected = selected.filter((v) => v[0] !== value[0]);

    const iFilter = remainingSelected.map((c: any) => ({
      data: { key: c[0] },
      name: 'nametoto',
      id: 'nametoto',
    }));

    updateFilters(
      history,
      { field: 'code', title: 'Study Code', type: VisualType.Checkbox },
      iFilter,
    );

    setSelected(remainingSelected);
  };

  const handleOnChange = (select: string[]) => {
    const codes = select.map((k: string) => k.split('|')[0]);

    const iFilter = codes.map((c: string) => ({
      data: { key: c },
      name: 'nametoto',
      id: 'nametoto',
    }));
    updateFilters(
      history,
      { field: 'code', title: 'Study Code', type: VisualType.Checkbox },
      iFilter,
    );
  };

  const selectProps = {
    mode: 'multiple' as const,
    style: { width: '100%' },
    value: selected,
    options,
    allowClear: true,
    onChange: (newSelect: string[]) => {
      // @ts-ignore
      setSelected(newSelect);
      handleOnChange(newSelect);
    },
    placeholder: 'KF-DSD, Neuroblastoma…',
    maxTagCount: 'responsive' as const,
    // @ts-ignore
    // eslint-disable-next-line react/display-name
    tagRender: ({ value }: string) => (
      <Tag key={value} closable onClose={() => handleClose(value)}>
        {value.split('|')[0]}
      </Tag>
    ),
  };

  //FIXME
  // @ts-ignore
  return <Select {...selectProps} />;
};

export default SearchBar;
