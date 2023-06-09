'use client';

import { TextInput, Button } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { setSliceInstrument } from '../slices/searchSlice';
import { IconBug } from '@tabler/icons-react';
import { showNotification } from '@mantine/notifications';
import axios from 'axios';

export default function ModalFilterInstrument({
	closeAllModals,
	setArtistsRecomendedFiltered,
	setArtistListFiltered,
	setHasNextPage,
	setHasPrevPage,
	setMax,
}: any) {
	const dispatch = useAppDispatch();
	const search = useAppSelector((state) => state.search);
	const form = useForm({
		initialValues: {
			instrument: '',
		},
	});

	return (
		<form
			onSubmit={form.onSubmit(async (values) => {
				closeAllModals();
				dispatch(setSliceInstrument({ instrument: values.instrument.toLowerCase() }));
				try {
					const resRecomended = await axios.get(
						`${process.env.NEXT_PUBLIC_GET_FILTERED_ARTISTS}?limit=5&page=1&instrument=${form.values.instrument}`
					);
					if (resRecomended.data.data.docs.length > 0) {
						setArtistsRecomendedFiltered(resRecomended.data.data.docs);
						setHasNextPage(resRecomended.data.data.nextPage);
						setHasPrevPage(resRecomended.data.data.prevPage);
						setMax(resRecomended.data.data.totalPages);
					} else {
						throw new Error('There are not artist with this instrument');
					}
					const resList = await axios.get(
						`${process.env.NEXT_PUBLIC_GET_FILTERED_ARTISTS}?limit=10&page=1&instrument=${form.values.instrument}`
					);
					if (resList.data.data.docs.length > 0) {
						setArtistListFiltered(resList.data.data.docs);
					} else {
						throw new Error('There are not artist with this instrument');
					}
				} catch {
					showNotification({
						id: 'load-data-user',
						color: 'red',
						title: 'There are not artist with this instrument',
						message: 'Notification will close in 4 seconds, you can close this notification now',
						icon: <IconBug size={16} />,
						autoClose: 4000,
					});
				}
			})}
		>
			<TextInput
				value={form.values.instrument}
				onChange={(e) => form.setFieldValue('instrument', e.currentTarget.value)}
				placeholder='Search by instruments'
				label='Instument'
				withAsterisk
				radius='xl'
			/>
			<Button fullWidth mt='md' type='submit'>
				Submit
			</Button>
		</form>
	);
}
