import React from 'react';
import { textBugWrapper } from './chartkit.module.css';

/**
 * Ref: https://github.com/kids-first/kf-portal-ui/pull/1006
 * IE, FF and Chrome all deal with svg text alignment differently
 * Nivo uses alignment-baseline which FF does not support
 * TextBugWrapper provides FF with correct attribute
 */
export const TextBugWrapper = ({ children }) => <div className={textBugWrapper}>{children}</div>;
