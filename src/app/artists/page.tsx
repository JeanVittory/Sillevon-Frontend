'use client';

import { useEffect, useLayoutEffect, useState } from 'react';
import axios from 'axios';
import { ActionIcon, Button, Tooltip } from '@mantine/core';
import { openModal, closeAllModals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { ArtistsTable } from '../../components/ArtistsTable';
import { IconBug, IconDisc, IconEar, IconTag } from '@tabler/icons-react';
import { SearcherBar } from '../../components/SearcherBar';
import ModalFilterGenre from '../../components/ModalFilterGenre';
import MusicianCarousel from '../../components/MusicianCarousel';
import { ModalFilterPrice } from '../../components/ModalFilterPrice';
import ModalFilterInstrument from '../../components/ModalFilterInstrument';
import { Pagination } from '../../components/Pagination';
import { Loader } from '../../components/Loader';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { setSliceCity } from '../../slices/searchSlice';
import { artistsService, artistsRecomendedService } from './services/artists';
import styles from '../../styles/Artists.module.scss';

interface ArtistsProps {
	nextPage: boolean;
	prevPage: boolean;
	max: number;
	artistsList: ArtistsList;
	artistsRecomended: artistsRecomended;
}

type artistsRecomended = {
	imagesDone: {
		avatar: string;
	};
	name: string;
	email: string;
	mode: string;
	instrument?: string;
	genre?: string;
	price: number;
}[];

type ArtistsList = {
	imagesDone: {
		avatar: string;
	};
	name: string;
	email: string;
	mode: string;
	instrument?: string;
	genre?: string;
	price: number;
}[];

const Artists = () => {
	const [iconLoading, setIconLoading] = useState<boolean>(false);
	const [artistListFiltered, setArtistListFiltered] = useState<ArtistsList>();
	const [artistsRecomendedFiltered, setArtistsRecomendedFiltered] = useState<artistsRecomended>();
	const [city, setCity] = useState<string>('');
	const dispatch = useAppDispatch();
	const [pagination, setPagination] = useState<number | undefined>(1);
	const [hasNextPage, setHasNextPage] = useState<boolean>();
	const [max, setMax] = useState<number>();
	const [hasPrevPage, setHasPrevPage] = useState<boolean>();
	const [isHidde, setIsHidde] = useState<boolean>(false);

	useEffect(() => {
		artistsService().then(({ artistsList, nextPage, prevPage, max }: any) => {
			setArtistListFiltered(artistsList);
			setHasNextPage(nextPage);
			setHasPrevPage(prevPage);
			setMax(max);
		});

		artistsRecomendedService().then(({ artistsRecomended }: any) => {
			setArtistsRecomendedFiltered(artistsRecomended);
		});
	}, []);

	useLayoutEffect(() => {
		dispatch(setSliceCity({ city }));
	}, [city, dispatch]);

	useEffect(() => {
		if (hasNextPage) {
			(async () => {
				const res = await fetch(
					`${process.env.NEXT_PUBLIC_GET_ARTIST_INITIAL_DATA}?limit=10&page=${pagination}`,
					{
						method: 'GET',
					}
				);
				const artists = await res.json();
				setHasNextPage(artists.data.hasNextPage);
				setHasPrevPage(artists.data.hasPrevPage);
				setArtistListFiltered(artists.data.docs);
			})();
		} else if (hasPrevPage) {
			(async () => {
				const res = await fetch(
					`${process.env.NEXT_PUBLIC_GET_ARTIST_INITIAL_DATA}?limit=10&page=${pagination}`,
					{
						method: 'GET',
					}
				);
				const artists = await res.json();
				setHasNextPage(artists.data.hasNextPage);
				setHasPrevPage(artists.data.hasPrevPage);
				setArtistListFiltered(artists.data.docs);
			})();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pagination]);

	async function filteredArtist() {
		try {
			setIconLoading(true);
			const resRecomended = await axios.get(
				`${process.env.NEXT_PUBLIC_GET_FILTERED_ARTISTS}?limit=5&page=1&city=${city}`
			);
			if (resRecomended.data.data.docs.length > 0) {
				setArtistsRecomendedFiltered(resRecomended.data.data.docs);
				setHasNextPage(resRecomended.data.data.nextPage);
				setHasPrevPage(resRecomended.data.data.prevPage);
				setMax(resRecomended.data.data.totalPages);
			} else {
				throw new Error('There are not artist in this location');
			}
			const resList = await axios.get(
				`${process.env.NEXT_PUBLIC_GET_FILTERED_ARTISTS}?limit=10&page=1&city=${city}`
			);
			if (resList.data.data.docs.length > 0) {
				setArtistListFiltered(resList.data.data.docs);
			} else {
				throw new Error('There are not artist in this location');
			}
		} catch (e) {
			showNotification({
				id: 'load-data-user',
				color: 'red',
				title: 'There are not artist in this location',
				message: 'Notification will close in 4 seconds, you can close this notification now',
				icon: <IconBug size={16} />,
				autoClose: 4000,
			});
		} finally {
			setIconLoading(false);
		}
	}
	if (!artistListFiltered)
		return (
			<div className={styles.loader}>
				<Loader />
			</div>
		);

	return (
		<section className={styles.artistsContainer}>
			<div className={styles.headerArtists}>
				<h1>Search for your dream band/artists</h1>
				<div className={styles.searcherBar}>
					<SearcherBar
						city={city}
						setCity={setCity}
						iconLoading={iconLoading}
						filteredArtist={filteredArtist}
					/>
				</div>
				<div className={styles.filterSection}>
					<Tooltip label='Genre'>
						<ActionIcon
							variant='outline'
							onClick={() => {
								openModal({
									title: 'Fiter by genre',
									className: `${styles.modalGenre}`,
									children: (
										<ModalFilterGenre
											setArtistsRecomendedFiltered={setArtistsRecomendedFiltered}
											setArtistListFiltered={setArtistListFiltered}
											closeAllModals={closeAllModals}
											setHasNextPage={setHasNextPage}
											setHasPrevPage={setHasPrevPage}
											setMax={setMax}
										/>
									),
								});
							}}
						>
							<IconEar />
						</ActionIcon>
					</Tooltip>
					<Tooltip label='Instrument'>
						<ActionIcon
							variant='outline'
							onClick={() => {
								openModal({
									title: 'Filter by instrument',
									children: (
										<ModalFilterInstrument
											setArtistsRecomendedFiltered={setArtistsRecomendedFiltered}
											setArtistListFiltered={setArtistListFiltered}
											closeAllModals={closeAllModals}
											setHasNextPage={setHasNextPage}
											setHasPrevPage={setHasPrevPage}
											setMax={setMax}
										/>
									),
								});
							}}
						>
							<IconDisc />
						</ActionIcon>
					</Tooltip>
					<Tooltip label='Price'>
						<ActionIcon
							variant='outline'
							onClick={() => {
								openModal({
									title: 'Filter by range of price',
									children: (
										<ModalFilterPrice
											setArtistsRecomendedFiltered={setArtistsRecomendedFiltered}
											setArtistListFiltered={setArtistListFiltered}
											closeAllModals={closeAllModals}
											setHasNextPage={setHasNextPage}
											setHasPrevPage={setHasPrevPage}
											setMax={setMax}
										/>
									),
								});
							}}
						>
							<IconTag />
						</ActionIcon>
					</Tooltip>
				</div>
			</div>
			<div className={styles.carousel}>
				<div className={styles.carouselNav}>
					{!isHidde ? <p>Artists recomended</p> : <p>List of artists</p>}
					<Button variant='subtle' onClick={() => setIsHidde((prev) => !prev)}>
						{isHidde ? 'Show' : 'Hide'}
					</Button>
				</div>
				{artistsRecomendedFiltered
					? !isHidde && <MusicianCarousel data={artistsRecomendedFiltered as artistsRecomended} />
					: null}
			</div>
			<div className={styles.bundleArtists}>
				{artistListFiltered && <ArtistsTable data={artistListFiltered as artistsRecomended} />}
			</div>
			<div className={styles.pagination}>
				<Pagination pagination={pagination} max={max} setPagination={setPagination} />
			</div>
		</section>
	);
};

export default Artists;
