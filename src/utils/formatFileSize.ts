// @flow
import filesize from 'filesize';

export enum EFileInputType {
    B = 'b',
    KB = 'kb',
    MB = 'mb',
}

type TFilesizeInput = (
    input?: number,
    options?: Record<string, any>,
    inputType?: EFileInputType
) => string | Record<string, any>;
type TConvertFileSize = (input: number, inputType: EFileInputType) => number;

const baseConversion = 1000;
const convertInputBase: TConvertFileSize = (input, inputType) => {
    switch (inputType) {
        case EFileInputType.MB:
            return input * baseConversion ** 2;
        case EFileInputType.KB:
            return input * baseConversion;
        default:
            return input;
    }
};

export const formatFileSize: TFilesizeInput = (input = 0, options, inputType = EFileInputType.B) => {
    const newInput = convertInputBase(input, inputType);
    const result = filesize(newInput || 0, {
        base: 10,
        ...options,
    });

    if (typeof result === 'string') {
        return result.toUpperCase();
    }

    return result;
};
