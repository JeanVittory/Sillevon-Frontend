'use client';

import { useEffect, useState } from 'react';
import { Center, Text } from '@mantine/core';
import Posts from '../../../components/Posts';
import UserStats from '../../../components/UserStats';
import Map from '../../../components/Map';
import { UserCardProfile } from '../../../components/UserCardProfile';
import { Loader } from '../../../components/Loader';
import { artistProfile } from './services/artistProfile';
import { useAppDispatch } from '../../../hooks/redux';
import { setAvatar } from '../../../slices/userSlice';
import styles from '../../../styles/ArtistsProfile.module.scss';

export default function ArtistsProfile() {
	const [user, setUser] = useState<any>();
	const dispatch: any = useAppDispatch();
	const [data, setData] = useState<any>();
	const [reFetch, setReFetch] = useState(false);

	useEffect(() => {
		artistProfile().then((response: any) => {
			setUser(response);
		});
	}, []);

	useEffect(() => {
		artistProfile().then((response: any) => {
			setUser(response);
		});
		setReFetch(false);
	}, [reFetch]);
	useEffect(() => {
		if (user) {
			setData({
				labels: ['Improvisation', 'Versatility', 'Repertoire', 'Instrumentation', 'Show'],
				datasets: [
					{
						label: 'Skills',
						data: [
							user.user.skills?.improvisation as number,
							user.user.skills?.versatility as number,
							user.user.skills?.repertoire as number,
							user.user.skills?.instrumentation as number,
							user.user.skills?.show as number,
						],
						fill: true,
						backgroundColor: 'rgba(59, 130, 245, 0.2)',
						borderColor: 'rgb(59, 130, 245)',
						pointBackgroundColor: 'rgb(59, 130, 245)',
						pointBorderColor: '#fff',
						pointHoverBackgroundColor: '#fff',
						pointHoverBorderColor: 'rgb(59, 130, 245)',
					},
				],
			});
		}
	}, [user]);

	if (!data || !user)
		return (
			<div className={styles.loaderContainer}>
				<Loader />
			</div>
		);

	//dispatch(setAvatar({ avatar: user?.imagesDone?.avatar }));

	return (
		<div className={styles.artistsProfileContainer}>
			<div className={styles.userProfileCardInfo}>
				<UserCardProfile
					user={user}
					avatar={user?.imagesDone?.avatar}
					name={user.name}
					setReFetch={setReFetch}
				/>
			</div>
			<div className={styles.postsContainerArtistProfile}>
				<Text
					component='span'
					align='center'
					p={'1rem'}
					variant='gradient'
					gradient={{ from: 'indigo', to: 'cyan', deg: 45 }}
					size={30}
					weight={700}
					style={{ fontFamily: 'Greycliff CF, sans-serif' }}
				>
					Dashboard
				</Text>
				<div className={styles.allProfilePosts}>
					{user?.user.posts?.length > 0 ? (
						user.user.posts.map((post: any) => (
							<Posts
								key={post._id}
								postId={post._id}
								urlImage={post.urlImage}
								title={post.title}
								likesAmount={post.likes}
								comments={post.comments}
							/>
						))
					) : (
						<Center>
							<Text>There is not posts</Text>
						</Center>
					)}
				</div>
			</div>
			<div>
				<div className={styles.userProfileStats}>
					<UserStats data={data} />
					<Map
						zoom={11}
						center={{ lat: 4.624335, lng: -74.063644 }}
						className={styles.userProfileMap}
						position={{ lat: 4.624335, lng: -74.063644 }}
					/>
				</div>
			</div>
		</div>
	);
}
