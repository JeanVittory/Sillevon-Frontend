'use client';

import type { NextPage } from 'next';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import Hero from '../components/Hero';
import HomeContent from '../components/HomeContent';
import { IconCheck, IconBug } from '@tabler/icons-react';
import { showNotification } from '@mantine/notifications';
import styles from '../styles/Home.module.scss';

const Home: NextPage = () => {
	const router = useRouter();
	const redirect_status = useSearchParams().get('redirect_status');

	useEffect(() => {
		if (redirect_status) {
			if (redirect_status.toString() === 'succeeded') {
				router.push('/profile/client/contracts');
				showNotification({
					id: 'payment succeded',
					color: 'teal',
					title: 'User was registered successfully',
					message: 'Notification will close in 4 seconds, you can close this notification now.',
					icon: <IconCheck />,
					autoClose: 4000,
				});
			} else {
				showNotification({
					id: 'payment succeded',
					color: 'red',
					title: 'User could not been registered',
					message: 'Notification will close in 4 seconds, you can close this notification now',
					icon: <IconBug size={16} />,
					autoClose: 4000,
				});
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [redirect_status]);

	return (
		<>
			<Hero />
			<div className={styles.homePage_content}>
				<HomeContent />
			</div>
		</>
	);
};

export default Home;
