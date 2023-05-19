import useSWR from 'swr';

async function pricingService() {
	try {
		const res = await fetch(process.env.NEXT_PUBLIC_GET_PLANS as string, {
			method: 'GET',
		});
		const plans = await res.json();
		const yearly = plans.data.filter((plan: any) => plan.billing === 'yearly').reverse();
		const monthly = plans.data.filter((plan: any) => plan.billing === 'monthly').reverse();
		return {
			yearly,
			monthly,
		};
	} catch (error) {
		return error;
	}
}

export default function usePricing() {
	const { data, error, isLoading } = useSWR(process.env.NEXT_PUBLIC_GET_PLANS, pricingService, {
		revalidateOnFocus: false,
	});

	return { data, error, isLoading };
}
