import React, { useEffect } from 'react';
import { VisualType } from '@ferlab/ui/core/components/filters/types';
import { Select, Tag } from 'antd';

import history from 'services/history';

import { useGetStudiesSearch } from '../../store/graphql/studies/actions';

import { ItemProps } from './SidebarFilters';
import { updateFilters, useFilters } from './utils';

type OwnProps = {
  options: ItemProps[];
};

const SearchBar = ({ options }: OwnProps) => {
  const [selected, setSelected] = React.useState([]);

  const { filters } = useFilters();

  const sqon = {
    content: [],
    op: 'and',
  };

  let { loading, data } = useGetStudiesSearch({
    sqon: sqon,
    first: 10,
    offset: 0,
  });

  useEffect(() => {
    if (filters.content && data && !loading) {
      const { content: find } =
        filters.content.find((s: { content: { field: string } }) => s.content.field === 'code') ||
        [];

      if (find) {
        const studiesInFilter = data.hits.edges.filter((n) => find.value.includes(n.node.code));
        // @ts-ignore
        setSelected([...selected, ...studiesInFilter.map((t) => [t.node.code, t.node.name])]);
      }
    }
  }, [data]);

  const handleClose = (value: any) => {
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

  const handleOnChange = (select: any) => {
    const codes = select.map((k: any[]) => k[0]);

    const iFilter = codes.map((c: any) => ({ data: { key: c }, name: 'nametoto', id: 'nametoto' }));
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
    onChange: (newSelect: string[]) => {
      // @ts-ignore
      setSelected(newSelect);
      handleOnChange(newSelect);
    },
    placeholder: 'KF-DSD, Neuroblastoma…',
    maxTagCount: 'responsive' as const,
    // eslint-disable-next-line react/display-name
    tagRender: ({ value }: any) => (
      <Tag key={value[0]} closable={true} onClose={() => handleClose(value)}>
        {value[0]}
      </Tag>
    ),
  };

  //FIXME
  // @ts-ignore
  return <Select {...selectProps} />;
};

export default SearchBar;
