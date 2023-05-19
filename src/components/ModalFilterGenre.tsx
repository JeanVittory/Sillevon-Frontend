'use client';

import { useState, useLayoutEffect } from 'react';
import axios from 'axios';
import { IconBug } from '@tabler/icons-react';
import { showNotification } from '@mantine/notifications';
import { Button, Select } from '@mantine/core';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { setSliceGenre } from '../slices/searchSlice';
import styles from '../styles/ModalGenre.module.scss';

export default function ModalFilterGenre({
	closeAllModals,
	setArtistsRecomendedFiltered,
	setArtistListFiltered,
}: any) {
	const [genre, setGenre] = useState<string | null>(null);
	const dispatch = useAppDispatch();
	const search = useAppSelector((state) => state.search);

	useLayoutEffect(() => {
		dispatch(setSliceGenre({ genre }));
	}, [genre, dispatch]);

	async function handleClick() {
		closeAllModals();
		try {
			const resRecomended = await axios.get(
				`${process.env.NEXT_PUBLIC_GET_FILTERED_ARTISTS}?limit=5&page=1&city=${
					search.city
				}&genre=${genre}&price=${JSON.stringify(search.price)}&instrument=${search.instrument}`
			);
			if (resRecomended.data.data.docs.length > 0) {
				setArtistsRecomendedFiltered(resRecomended.data.data.docs);
			} else {
				throw new Error('There are not artist with this genre');
			}
			const resList = await axios.get(
				`${process.env.NEXT_PUBLIC_GET_FILTERED_ARTISTS}?limit=10&page=1&city=${
					search.city
				}&genre=${genre}&price=${JSON.stringify(search.price)}&instrument=${search.instrument}`
			);
			if (resList.data.data.docs.length > 0) {
				setArtistListFiltered(resList.data.data.docs);
			} else {
				throw new Error('There are not artist with this genre');
			}
		} catch {
			showNotification({
				id: 'load-data-user',
				color: 'red',
				title: 'There are not artist with this genre',
				message: 'Notification will close in 4 seconds, you can close this notification now',
				icon: <IconBug size={16} />,
				autoClose: 4000,
			});
		}
	}

	return (
		<div className={styles.modal}>
			<Select
				value={genre}
				withAsterisk
				onChange={(value) => setGenre(value)}
				label='Your favorite genre'
				placeholder='Pick one genre'
				searchable
				nothingFound='No options'
				radius='xl'
				clearable
				dropdownPosition='bottom'
				withinPortal
				transitionProps={{ transition: 'pop-bottom-right', duration: 80, timingFunction: 'ease' }}
				data={[
					{ value: 'Rock', label: 'Rock' },
					{ value: 'Pop', label: 'Pop' },
					{ value: 'Popular music', label: 'Popular music' },
					{ value: 'Jazz', label: 'Jazz' },
					{ value: 'Blues', label: 'Blues' },
					{ value: 'Reggaeton', label: 'Reggaeton' },
					{ value: 'Metal', label: 'Metal' },
					{ value: 'Salsa', label: 'Salsa' },
				]}
			/>
			<Button fullWidth onClick={handleClick} mt='md'>
				Submit
			</Button>
		</div>
	);
}
