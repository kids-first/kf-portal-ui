import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import ScrollContent from '@ferlab/ui/core/layout/ScrollContent';

import PublicLayout from 'components/PublicLayout';
import { fetchStats } from 'store/global/thunks';

import PageContent from './PageContent';
import { SCROLL_WRAPPER_ID } from './utils';

import style from './index.module.css';

const PublicStudies = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchStats());
  }, [dispatch]);

  return (
    <PublicLayout>
      <div className={style.studiesPage}>
        <ScrollContent id={SCROLL_WRAPPER_ID} className={style.scrollContent}>
          <PageContent />
        </ScrollContent>
      </div>
    </PublicLayout>
  );
};

export default PublicStudies;
