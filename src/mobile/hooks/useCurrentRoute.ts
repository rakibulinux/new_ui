import { useLocation } from 'react-router-dom';

export const useCurrentRoute = (targetRoute: string, absolute?: boolean) => {
	const { pathname } = useLocation();

	return absolute ? pathname === targetRoute : pathname.includes(targetRoute);
};
