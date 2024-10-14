import { useEffect, useRef, useState } from 'react';
import useIsomorphicEffect from './useIsomorphicEffect';

const useIsOverflow = (ref) => {
    const [isOverflow, setIsOverflow] = useState(false);

    useIsomorphicEffect(() => {
        const { current } = ref;
        if (current) {
            const hasOverflow = current.scrollWidth > current.clientWidth;
            setIsOverflow(hasOverflow);
        }
    }, [ref.current, ref.current?.scrollWidth, ref.current?.clientWidth]); // 추가적인 종속성

    return isOverflow;
};

export default useIsOverflow;
