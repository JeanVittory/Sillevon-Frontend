'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Divider, UnstyledButton, Text } from '@mantine/core';
import { IconChevronLeft } from '@tabler/icons-react';
import statsArtistService from './service/statsArtistService';
import Layout from '../../../../components/Layout';
import { ContractStats } from '../../../../components/ContractStats';
import { StatsRing } from '../../../../components/StatsRing';
import { Loader } from '../../../../components/Loader';
import { ConnectionsProps } from '../../client/connections/page';
import styles from '../../../../styles/ArtistStats.module.scss';

interface StatsProps extends ConnectionsProps {}

export default function Stats() {
	const [user, setUser] = useState<StatsProps>();
	const router = useRouter();

	useEffect(() => {
		statsArtistService().then((response) => setUser(response));
	}, []);

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
	const dataForRings = [
		{
			label: 'Connections',
			stats: connectionsAmount,
			progress: new Date().getDate(),
			color: 'teal',
			icon: 1,
		},
		{
			label: 'Contracts',
			stats: contractsAmount,
			progress: new Date().getDate(),
			color: 'blue',
			icon: 1,
		},
		{
			label: labelThree,
			stats: labelThreeStats,
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
		<div className={styles.statsContainer}>
			<UnstyledButton mb={20} onClick={() => router.push('/profile/artists')}>
				<IconChevronLeft size={40} />
			</UnstyledButton>
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
			<ContractStats contracts={user?.user.contracts!} />
			<Divider mt={20} mb={20} />
			<StatsRing data={dataForRings as any} />
		</div>
	);
}
