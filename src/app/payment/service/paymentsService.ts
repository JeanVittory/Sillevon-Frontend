import Cookies from 'js-cookie';

export default async function paymentService(name: string) {
	const token = Cookies.get('sillusr');
	let contracts;
	try {
		const res = await fetch(`${process.env.NEXT_PUBLIC_GET_BY_NAME}/${name}`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
			},
			cache: 'no-store',
		});
		contracts = await res.json();
		return {
			contracts: contracts.data,
		};
	} catch (e) {
		contracts = { data: 'There are not contracts' };
	}
}
