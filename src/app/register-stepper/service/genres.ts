import useSWR from 'swr';
import { loadGenres } from '../../../lib/loadGenres';

export default function useGenres() {
	const { data, error, isLoading, isValidating } = useSWR('genres', loadGenres, {
		revalidateOnFocus: false,
	});

	return { data, error, isLoading, isValidating };
}
