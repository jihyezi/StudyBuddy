import { useState, useRef } from 'react';
import useIsomorphicEffect from './useIsomorphicEffect';

const useIsOverflow = (ref) => {
    const [isOverflow, setIsOverflow] = useState(false);

    useIsomorphicEffect(() => {
        const { current } = ref;
        if (current) {
            const hasOverflow = current.scrollWidth > current.clientWidth;
            setIsOverflow(hasOverflow);
        }
    }, [ref]);

    return isOverflow;
};

export default useIsOverflow;
