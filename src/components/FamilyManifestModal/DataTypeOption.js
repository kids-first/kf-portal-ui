import React from 'react';
import { Field } from 'formik';
import filesize from 'filesize';

const DataTypeOption = ({ bucket, values, fileSize }) => {
  return (
    <label
      css={`
        display: flex;
        padding: 17px 24px 17px 18px;
        margin-bottom: 8px;
        border-radius: 10px;
        background-color: #e5f7fd;
        border: solid 1px #00afed;
      `}
    >
      <div
        css={`
          flex-grow: 1;
          font-size: 16px;
          letter-spacing: 0.2px;
          color: #2b388f;
        `}
      >
        <Field name={bucket.key} type="checkbox" value={values[bucket.key]} /> {bucket.key}
      </div>
      <div
        css={`
          font-size: 14px;
          font-weight: bold;
          letter-spacing: 0.2px;
          color: #343434;
        `}
      >
        <span
          css={`
            vertical-align: middle;
          `}
        >
          {bucket.doc_count} Files
        </span>
        <div
          css={`
            width: 2px;
            height: 15px;
            background: currentColor;
            display: inline-block;
            vertical-align: middle;
            margin: 0 5px 0 18px;
          `}
        />
        <span
          css={`
            vertical-align: middle;
            display: inline-block;
            text-align: right;
            min-width: 80px;
          `}
        >
          {filesize(fileSize || 0, { base: 10 }).toUpperCase()}
        </span>
      </div>
    </label>
  );
};

export default DataTypeOption;
