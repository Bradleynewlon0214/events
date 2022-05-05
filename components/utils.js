// import { stringify } from "qs"
import { useEffect, useRef } from 'react';

export const queryFromSwitch = (queryFrom) => {
    var query;
    switch(queryFrom){
        case 'service':
            // query = stringify({
            //     sort: ['Title:asc']
            // });
            return `/api/services`
        case 'community':
            return `/api/communities`
        case 'careers':
            return `/api/careers`
        case 'patients':
            return `/api/patients`
        default:
            // query = stringify({
            //     sort: ['Name']
            // });
            return ''

    }
}


export const nthEven = (num = 1) => {
    const next = num * 2;
    return next - 2;
} 

export const useIntersectionObserver = (options = null, intersectFunction) => {

    const ref = useRef();
    

    if(options === null){
        options = {
            root: null,
            rootMargin: '50px',
            threshold: 0.5
        }
    }

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            const [ entry ] = entries;
            if(entry.isIntersecting){
                intersectFunction();
            }
        }, options);
        var current = ref.current;
        if(current) observer.observe(current);

        return () => {
            if(current) observer.unobserve(current)
        }
    }, [ref, options, intersectFunction]);

    return ref; 
}