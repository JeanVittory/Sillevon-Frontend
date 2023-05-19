export async function loadGenres() {
	const res = await fetch(process.env.NEXT_PUBLIC_POST_GENRE as string);
	const genres = await res.json();
	return genres.data;
}
