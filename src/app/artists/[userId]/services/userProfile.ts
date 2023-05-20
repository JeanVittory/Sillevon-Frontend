export async function userProfileService(userId: string) {
	try {
		let user;
		if (userId) {
			const res = await fetch(`${process.env.NEXT_PUBLIC_GET_ARTIST_BY_EMAIL}/${userId}`, {
				method: 'GET',
			});
			user = await res.json();
		}
		return { user: user.data };
	} catch (error) {
		console.log(error);
	}
}
