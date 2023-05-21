import Cookies from 'js-cookie';

export async function contractsUser() {
	try {
		const token = Cookies.get('sillusr');
		let userData;
		try {
			const res = await fetch(process.env.NEXT_PUBLIC_GET_UPDATE_DATAUSER as string, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`,
				},
				cache: 'no-store',
			});
			userData = await res.json();
		} catch (e) {
			userData = { data: 'Token has expired' };
		}
		return {
			user: userData.data,
		};
	} catch (error) {}
}
