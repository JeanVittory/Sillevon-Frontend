import useSWR from 'swr';
import cookies from 'js-cookie';

const dataService = async () => {
	const token = cookies.get('sillusr');
	let userData;
	try {
		if (token) {
			const res = await fetch(process.env.NEXT_PUBLIC_GET_UPDATE_DATAUSER as string, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`,
				},
				cache: 'no-store',
			});
			userData = await res.json();
		} else {
			userData = { data: 'Token has expired' };
		}

		return {
			user: userData.data,
		};
	} catch (error) {
		return error;
	}
};

const userPostService = async () => {
	try {
		const token = cookies.get('sillusr');

		const res = await fetch(`${process.env.NEXT_PUBLIC_GET_ALL_POSTS}?limit=10&page=1`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
			},
			cache: 'no-store',
		});
		let posts = await res.json();
		let ordered = posts.data.docs;
		return {
			post: ordered,
		};
	} catch (error) {
		return error;
	}
};

export function useClientData() {
	const { data, error, isLoading } = useSWR<any>(
		process.env.NEXT_PUBLIC_GET_UPDATE_DATAUSER as string,
		dataService
	);

	return { data, error, isLoading };
}

export function usePostClient() {
	const { data, error, isLoading } = useSWR<any>(
		`${process.env.NEXT_PUBLIC_GET_ALL_POSTS}?limit=10&page=1}`,
		userPostService,
		{
			revalidateOnFocus: false,
		}
	);

	return { data, error, isLoading };
}
