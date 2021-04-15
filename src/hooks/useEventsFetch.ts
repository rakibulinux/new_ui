import * as React from 'react';
import { useDispatch} from 'react-redux';
import { eventFetch } from '../modules/info/events';

export const useEventsFetch = () => {
    const dispatch = useDispatch();

    React.useEffect(() => {
            dispatch(eventFetch());
    }, [dispatch]);
};
