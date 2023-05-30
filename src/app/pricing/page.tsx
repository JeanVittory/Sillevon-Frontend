'use client';

import { useState } from 'react';
import { Text, SegmentedControl } from '@mantine/core';
import Layout from '../../components/Layout';
import { PricingCard } from '../../components/PricingCard';
import { Loader } from '../../components/Loader';
import usePricing from './services/pricing';
import styles from '../../styles/Pricing.module.scss';

type Plan = {
	title: string;
	features: string[];
	billing: string;
	description: string;
	price: number;
	_id: string;
	createdAt: string;
	updatedAt: string;
}[];

interface PricingProps {
	yearly: Plan;
	monthly: Plan;
}

const Pricing = () => {
	const [billing, setBilling] = useState('monthly');
	const { data, isLoading } = usePricing() as { data: PricingProps; isLoading: boolean };
	if (isLoading)
		return (
			<div className={styles.loaderContainer}>
				<Loader />
			</div>
		);
	const monthlyToRender = data.monthly.map((plan, i) => (
		<PricingCard key={`${plan._id}monthly${i}`} plan={plan} />
	));
	const yearlyToRender = data.yearly.map((plan, i) => (
		<PricingCard key={`${plan._id}yearly${i + 1}`} plan={plan} />
	));

	return (
		<div className={styles.pricing}>
			<div className={styles.title}>
				<Text
					component='span'
					align='center'
					variant='gradient'
					gradient={{ from: 'indigo', to: 'cyan', deg: 45 }}
					size={60}
					weight={700}
					style={{ fontFamily: 'Greycliff CF, sans-serif' }}
				>
					Pricing plans
				</Text>
			</div>
			<div className={styles.description}>
				<Text>
					If you have a bussines and you want live music in your place, those plans are for you!
				</Text>
			</div>
			<SegmentedControl
				className={styles.segmented}
				size='md'
				value={billing}
				onChange={setBilling}
				data={[
					{ label: 'Monthly billing', value: 'monthly' },
					{ label: 'Yearly billing', value: 'yearly' },
				]}
			/>
			<div className={styles.cardsContainer}>
				{billing === 'monthly' ? monthlyToRender : yearlyToRender}
			</div>
		</div>
	);
};

export default Pricing;
