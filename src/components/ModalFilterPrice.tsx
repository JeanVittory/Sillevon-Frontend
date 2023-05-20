'use client';

import { useState, Dispatch, SetStateAction } from 'react';
import { Button, RangeSlider } from '@mantine/core';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { setSlicePrice } from '../slices/searchSlice';
import axios from 'axios';
import { IconBug } from '@tabler/icons-react';
import { showNotification } from '@mantine/notifications';

export function ModalFilterPrice({
	setArtistsRecomendedFiltered,
	setArtistListFiltered,
	closeAllModals,
	setHasNextPage,
	setHasPrevPage,
	setMax,
}: any) {
	const [rangeValue, setRangeValue] = useState<[number, number]>([10, 30]);
	const dispatch = useAppDispatch();
	const search = useAppSelector((state) => state.search);

	async function handleClick() {
		dispatch(setSlicePrice({ price: rangeValue }));
		closeAllModals();
		try {
			const resRecomended = await axios.get(
				`${process.env.NEXT_PUBLIC_GET_FILTERED_ARTISTS}?limit=5&page=1&price=${JSON.stringify(
					rangeValue
				)}`
			);
			if (resRecomended.data.data.docs.length > 0) {
				setArtistsRecomendedFiltered(resRecomended.data.data.docs);
				setHasNextPage(resRecomended.data.data.nextPage);
				setHasPrevPage(resRecomended.data.data.prevPage);
				setMax(resRecomended.data.data.totalPages);
			} else {
				throw new Error('There are not artist with this genre');
			}
			const resList = await axios.get(
				`${process.env.NEXT_PUBLIC_GET_FILTERED_ARTISTS}?limit=10&page=1&price=${JSON.stringify(
					rangeValue
				)}`
			);
			if (resList.data.data.docs.length > 0) {
				setArtistListFiltered(resList.data.data.docs);
			} else {
				throw new Error('There are not artist with this genre');
			}
		} catch (error) {
			showNotification({
				id: 'load-data-user',
				color: 'red',
				title: 'There are not artist with this range price',
				message: 'Notification will close in 4 seconds, you can close this notification now',
				icon: <IconBug size={16} />,
				autoClose: 4000,
			});
		}
	}

	return (
		<>
			<RangeSlider
				value={rangeValue}
				onChange={setRangeValue}
				mb={40}
				mr={20}
				marks={[
					{ value: 10, label: '$10/hr' },
					{ value: 30, label: '$30/hr' },
					{ value: 50, label: '$50/hr' },
					{ value: 70, label: '$70/hr' },
					{ value: 100, label: '$100/hr' },
				]}
			/>
			<Button fullWidth onClick={handleClick} mt='md'>
				Submit
			</Button>
		</>
	);
}
