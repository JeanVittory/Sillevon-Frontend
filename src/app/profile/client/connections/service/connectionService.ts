import Cookies from 'js-cookie';

export async function connectionService() {
	try {
		const token = Cookies.get('sillusr');
		let userData;

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
}
