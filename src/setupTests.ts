import 'regenerator-runtime/runtime';
import '@testing-library/jest-dom';

jest.mock('@kfarranger/components/dist', () =>
  jest.fn().mockImplementation(() => ({
    addHeaders: () => {},
  })),
);
