import Cookies from 'js-cookie';

export async function artistProfile() {
	try {
		const token = Cookies.get('sillusr');

		let userData;
		if (token) {
			const res = await fetch(process.env.NEXT_PUBLIC_GET_UPDATE_DATAUSER as string, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			userData = await res.json();
		}
		return {
			user: userData.data,
		};
	} catch (error) {
		return error;
	}
}
