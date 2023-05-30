'use client';
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../../components/CheckoutForm';
import styles from '../../styles/Payment.module.scss';
import Cookies from 'js-cookie';
import { useSearchParams } from 'next/navigation';
import paymentService from './service/paymentsService';
const stipeSecretKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string;
const stripePromise = loadStripe(stipeSecretKey);

type Appearance = { theme: 'stripe' | 'flat' };

export default function Payment() {
	const [clientSecret, setClientSecret] = useState('');
	const searchParams = useSearchParams();
	const name = searchParams.get('name');
	const token = Cookies.get('sillusr');

	useEffect(() => {
		const contracts = paymentService(name!).then((response) => response);
		fetch(process.env.NEXT_PUBLIC_POST_PAYMENT as string, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ contracts }),
		})
			.then((res) => res.json())
			.then((data) => setClientSecret(data.clientSecret));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const appearance: Appearance = {
		theme: 'flat',
	};
	const options = {
		clientSecret,
		appearance,
	};

	return (
		<div className={styles.paymentContainer}>
			{clientSecret && (
				<Elements options={options} stripe={stripePromise}>
					<CheckoutForm />
				</Elements>
			)}
		</div>
	);
}
