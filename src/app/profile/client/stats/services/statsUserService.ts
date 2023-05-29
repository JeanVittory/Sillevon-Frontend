import Cookies from 'js-cookie';

export default async function statsUserService() {
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
		return {
			user: userData.data,
		};
	} catch (e) {
		return (userData = { data: 'Token has expired' });
	}
}
