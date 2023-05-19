import useSWR from 'swr';

export async function artistsService() {
	try {
		const resList = await fetch(
			`${process.env.NEXT_PUBLIC_GET_ARTIST_INITIAL_DATA}?limit=10&page=1`,
			{
				method: 'GET',
			}
		);
		const artistsList = await resList.json();

		return {
			max: artistsList.data.totalPages,
			prevPage: artistsList.data.hasPrevPage,
			nextPage: artistsList.data.hasNextPage,
			artistsList: artistsList.data.docs,
		};
	} catch (error) {
		return error;
	}
}

export async function artistsRecomendedService() {
	try {
		const resCarousel = await fetch(process.env.NEXT_PUBLIC_GET_ARTIST_RECOMMENDED as string, {
			method: 'GET',
		});
		const artistsRecomended = await resCarousel.json();
		const toFront = [];
		const filtered = artistsRecomended.data.sort(
			(a: any, b: any) => b.connections.length - a.connections.length
		);
		if (filtered.length > 5) {
			for (let i = 0; i < 5; i++) {
				const element = filtered[i];
				toFront.push(element);
			}
		}

		return {
			artistsRecomended: toFront,
		};
	} catch (error) {
		console.log(error);
		return error;
	}
}
export function useArtists() {
	const { data, error, isLoading } = useSWR<any>('artist', artistsService, {
		revalidateOnFocus: false,
	});
	console.log(data);
	return {
		data,
		error,
		isLoading,
	};
}

export function useArtistRecomended() {
	const { data, error, isLoading } = useSWR(
		process.env.NEXT_PUBLIC_GET_ARTIST_RECOMMENDED as string,
		artistsRecomendedService,
		{ revalidateOnFocus: false }
	);

	return {
		data,
		error,
		isLoading,
	};
}
