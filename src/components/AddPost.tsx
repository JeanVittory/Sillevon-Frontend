'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import Cookies from 'js-cookie';
import { showNotification } from '@mantine/notifications';
import { Button, TextInput } from '@mantine/core';
import { FileWithPath } from '@mantine/dropzone';
import { IconBug, IconCheck } from '@tabler/icons-react';
import { DropZone } from './DropZone';
import { Loader } from './Loader';
import style from '../styles/AddPost.module.scss';

interface AddPostProps {
	closeAllModals: (payload_0?: undefined) => void;
	setReFetch: any;
}

export default function AddPost({ closeAllModals, setReFetch }: AddPostProps) {
	const [title, setTitle] = useState<string>('');
	const [image, setImage] = useState<FileWithPath | null>(null);
	const [preview, setPreview] = useState<string | ArrayBuffer | null>('');
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const router = useRouter();

	function readPost(file: FileWithPath | null | undefined) {
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				if (e.target) {
					setPreview(e.target.result);
				}
			};
			reader.readAsDataURL(file);
		}
	}
	readPost(image);

	async function handlePostClick() {
		const token = Cookies.get('sillusr');
		const data = new FormData();
		data.append('title', title);
		data.append('urlImage', image as string | Blob, image?.name);
		try {
			setIsLoading(true);
			const res = await axios.post(process.env.NEXT_PUBLIC_POST_POSTS as string, data, {
				headers: {
					'Content-Type': 'multipart/form-data',
					Authorization: `Bearer ${token}`,
				},
			});
			showNotification({
				id: 'load-data-user',
				color: 'teal',
				title: res.data.message,
				message: 'Notification will close in 4 seconds, you can close this notification now',
				icon: <IconCheck size={16} />,
				autoClose: 4000,
			});
			closeAllModals();
			setReFetch(true);
			setIsLoading(false);
			router.push('/profile/artists');
		} catch (e) {
			showNotification({
				id: 'load-data-user',
				color: 'red',
				title: 'User could not be updated',
				message: 'Notification will close in 4 seconds, you can close this notification now',
				icon: <IconBug size={16} />,
				autoClose: 4000,
			});
		}
	}

	return (
		<div className={style.addPostModalContainer}>
			<TextInput
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				placeholder='Title'
				description='Type a title for your post'
			/>
			<div className={style.imagePostPreview}>
				{image && (
					<Image
						src={preview as string}
						alt={title}
						width={700}
						height={500}
						className={style.postModalImage}
					/>
				)}
			</div>
			<div className={style.postModalDropZone}>
				{!image && <DropZone type='post' setImage={setImage} />}
			</div>
			<Button onClick={handlePostClick} fullWidth>
				{isLoading ? <Loader /> : 'Post'}
			</Button>
		</div>
	);
}
