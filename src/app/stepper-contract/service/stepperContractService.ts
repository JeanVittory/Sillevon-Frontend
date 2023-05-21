import Cookies from 'js-cookie';

export async function stepperContractService() {
	try {
		const token = Cookies.get('sillusr');
		let userData;

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
	} catch (error) {
		return 'Token has expired';
	}
}
