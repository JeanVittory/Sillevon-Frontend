import Cookies from 'js-cookie';

export default async function userSettingsService() {
	const token = Cookies.get('sillusr');
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
	} catch (e) {
		console.log(e);
	}
}
