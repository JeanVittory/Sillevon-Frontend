'use client';

import { Card, Avatar, Text, Button, Image } from '@mantine/core';
import { DropZone } from './DropZone';
import MapForRegister from './MapForRegister';
import { openModal, closeAllModals } from '@mantine/modals';
import { useAppSelector } from '../hooks/redux';
import { useLayoutEffect, useState } from 'react';
import { FileWithPath } from '@mantine/dropzone';
import { useTuneUpProfilePhotosStyles } from './ui/useTuneUpProfilePhotosStyles';
import styles from '../styles/TuneUpProfilePhotos.module.scss';

type ReaderState = string | ArrayBuffer | null;

export function TuneUpProfilePhotos() {
	const { classes } = useTuneUpProfilePhotosStyles();
	const [toRenderAvatar, setToRenderAvatar] = useState<ReaderState>(null);
	const [toRenderBackground, setToRenderBackground] = useState<ReaderState>(null);
	const { avatar, background, name } = useAppSelector((state) => state.user);
	const handleModals = () => {
		closeAllModals();
	};

	const readFileAvatar = (file: FileWithPath | null | undefined) => {
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				if (e.target) {
					setToRenderAvatar(e.target.result);
				}
			};
			reader.readAsDataURL(file);
		}
	};

	const readFileBackground = (file: FileWithPath | null | undefined) => {
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				if (e.target) {
					setToRenderBackground(e.target.result);
				}
			};
			reader.readAsDataURL(file);
		}
	};

	useLayoutEffect(() => {
		readFileAvatar(avatar);
		readFileBackground(background);
	}, [avatar, background]);

	const backgroundPhotoPreview =
		toRenderBackground ||
		'https://res.cloudinary.com/dhrs1koll/image/upload/v1667578196/sillevon/zdlh0oo53lzzbvqoslyz.png';

	return (
		<div className={styles.profilePhotos}>
			<Card withBorder p='xl' radius='md' className={`${classes.card} ${styles.tuneUp__card}`}>
				<Image
					src={backgroundPhotoPreview as string}
					width={270}
					height={160}
					alt='background to set'
				/>
				<Avatar
					src={toRenderAvatar as string}
					size={100}
					radius={80}
					mx='auto'
					mt={-30}
					className={classes.avatar}
				/>
				<Text align='center' size='lg' weight={500} mt='sm'>
					{name || 'Your Name'}
				</Text>
				<div className={`${styles.tuneUp__buttons}`}>
					<Button
						onClick={() => {
							openModal({
								title: 'Avatar image',
								children: (
									<>
										<DropZone type='avatar' />
										<Button fullWidth onClick={handleModals} mt='md'>
											Submit
										</Button>
									</>
								),
							});
						}}
					>
						Avatar
					</Button>
					<Button
						onClick={() => {
							openModal({
								title: 'Background image',
								children: (
									<>
										<DropZone type='background' />
										<Button fullWidth onClick={handleModals} mt='md'>
											Submit
										</Button>
									</>
								),
							});
						}}
					>
						Background
					</Button>
				</div>
			</Card>

			{/* <div>
				<MapForRegister />
			</div> */}
		</div>
	);
}
