'use client';

import { useState, useEffect } from 'react';
import { Divider, Text } from '@mantine/core';
import Layout from '../../../../components/Layout';
import { StatsRing } from '../../../../components/StatsRing';
import { ContractStats } from '../../../../components/ContractStats';
import ClientLayout from '../../../../components/ClientLayout';
import { Loader } from '../../../../components/Loader';
import { ConnectionsProps } from '../connections/page';
import statsUserService from './services/statsUserService';
import styles from '../../../../styles/StatsPage.module.scss';

interface StatsProps extends ConnectionsProps {}

export default function Stats() {
	const [user, setUser] = useState<StatsProps>();
	const connectionsAmount = user?.user.connections.length;
	const contractsAmount = user?.user.contracts.length;
	const labelThree = user?.user.mode === 'customer' ? 'Balance' : 'Likes';
	const likes = user?.user.posts.reduce((a, b) => a + b.likes, 0);
	const balance = user?.user.contracts.reduce((a, b) => {
		if (b.price) {
			return a + b.price;
		} else {
			return a;
		}
	}, 0);
	const labelThreeStats = user?.user.mode === 'customer' ? `$ ${balance?.toFixed(2)}` : likes;

	useEffect(() => {
		statsUserService().then((response) => setUser(response as any));
	}, []);

	const dataForRings = [
		{
			label: 'Connections',
			stats: connectionsAmount!,
			progress: new Date().getDate(),
			color: 'teal',
			icon: 1,
		},
		{
			label: 'Contracts',
			stats: contractsAmount!,
			progress: new Date().getDate(),
			color: 'blue',
			icon: 1,
		},
		{
			label: labelThree,
			stats: labelThreeStats!,
			progress: new Date().getDate(),
			color: 'violet',
			icon: 1,
		},
	];

	if (!user)
		return (
			<div className={styles.loader}>
				<Loader />
			</div>
		);

	return (
		<ClientLayout>
			<Text
				component='span'
				align='center'
				variant='gradient'
				gradient={{ from: 'indigo', to: 'cyan', deg: 45 }}
				size={40}
				weight={700}
				style={{ fontFamily: 'Greycliff CF, sans-serif', padding: '2rem' }}
			>
				Stats
			</Text>
			<div className={styles.statsContainer}>
				<ContractStats contracts={user?.user.contracts!} />
				<Divider mt={20} mb={20} />
				<StatsRing data={dataForRings} />
			</div>
		</ClientLayout>
	);
}
