import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import OntologyModal from '../OntologyBrowser';
import { openModal, closeModal } from 'store/actions/modal';
import { supportOntologyBrowser } from 'components/OntologyBrowser/OntologyBrowser';
import { RootState } from 'store/rootState';
import { Sqon } from 'store/sqon';
import SQONProvider from './SQONProvider';
import { ModalStateType } from 'store/reducers/modal';

type ModalsProps = {
  initialSqon: Sqon;
};
type mergeSqonToActiveIndexType = (a: Sqon) => undefined;
const OBSEVED_PHENOTYPE_NAME = 'observed_phenotype.name';

export const Modals = (props: ModalsProps) => {
  const ontologyModalState: ModalStateType | null = useSelector((state: RootState) =>
    state.modal.isVisible && state.modal.id === OBSEVED_PHENOTYPE_NAME ? state.modal : null,
  );
  const dispatch = useDispatch();

  return (
    <SQONProvider>
      {({ mergeSqonToActiveIndex }: { mergeSqonToActiveIndex: mergeSqonToActiveIndexType }) => {
        const categoriesSqonUpdate = (newSqon: Sqon) => {
          mergeSqonToActiveIndex(newSqon);
        };
        return (
          (ontologyModalState && (
            <OntologyModal
              isVisible={true}
              onCloseModal={() => dispatch(closeModal(OBSEVED_PHENOTYPE_NAME))}
              initialSqon={props.initialSqon}
              onSqonUpdate={(sqon: Sqon) => {
                categoriesSqonUpdate(sqon);
              }}
              title={OBSEVED_PHENOTYPE_NAME}
              selectedField={OBSEVED_PHENOTYPE_NAME}
              key={OBSEVED_PHENOTYPE_NAME}
            />
          )) ||
          null
        );
      }}
    </SQONProvider>
  );
};

export const arrangerActions = (dispatch: Function) => {
  const onBrowseModal = () => {
    dispatch(openModal(OBSEVED_PHENOTYPE_NAME));
  };

  return {
    TermFilter: {
      extraFilterActions: {
        isVisible: (field: string) => supportOntologyBrowser(field),
        component: (
          <span
            className={`aggsFilterAction extraActions`}
            onClick={onBrowseModal}
            onKeyPress={onBrowseModal}
            role="link"
            tabIndex={-1}
          >
            Browser
          </span>
        ),
      },
    },
  };
};
