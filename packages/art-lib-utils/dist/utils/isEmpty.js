/**
 * Checks whether a value is empty.
 */
export const isEmpty = (value) => {
    if (Array.isArray(value)) {
        return value.length === 0;
    }
    else if (typeof value === 'object') {
        if (value) {
            for (const _ in value) {
                return false;
            }
        }
        return true;
    }
    else {
        return !value;
    }
};
