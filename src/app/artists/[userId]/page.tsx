'use client';

import { useState, useEffect } from 'react';
import { Center, Text } from '@mantine/core';
import { userProfileService } from './services/userProfile';
import { UserCard } from '../../../components/UserCard';
import UserStats from '../../../components/UserStats';
import styles from '../../../styles/UserIdArtists.module.scss';
import Posts from '../../../components/Posts';
import Map from '../../../components/Map';

export interface ArtistProfileClientProps {
	user: {
		imagesDone: {
			avatar: string;
			background: string;
		};
		location: {
			lat: number;
			lng: number;
		};
		skills: {
			improvisation: number;
			show: number;
			repertoire: number;
			versatility: number;
			instrumentation: number;
		};
		name: string;
		email: string;
		terms: boolean;
		mode: string;
		favoriteGenres: [];
		posts: {
			likes: number;
			_id: string;
			title: string;
			urlImage: string;
			comments: {
				body: string;
				_id: string;
				author: {
					imagesDone: {
						avatar: string;
					};
					name: string;
				};
				post: object;
				createdAt: string;
				updatedAt: string;
			}[];
		}[];
		city: string;
		price: number;
		genre: string;
		instrument: string;
		connections: any[];
		contracts: [];
	};
}

const ArtistProfileClient = ({ params }: any) => {
	const [connections, setConnections] = useState<[]>([]);
	const [user, setUser] = useState<ArtistProfileClientProps>();
	const [mockData, setMockData] = useState<any>();
	const [data, setData] = useState<any>();

	useEffect(() => {
		userProfileService(decodeURIComponent(params.userId)).then((response: any) => {
			setUser(response);
		});
	}, []);

	useEffect(() => {
		if (user) {
			setMockData({
				image: user!.user.imagesDone.background,
				avatar: user!.user.imagesDone.avatar,
				name: user!.user.name,
				job: user!.user.mode,
				stats: [
					{
						value: user!.user.contracts!.length || 0,
						label: 'Contracts',
					},
					{
						value: user!.user.connections!.length || 0,
						label: 'Connections',
					},
					{
						value: user!.user.posts.length || 0,
						label: 'Posts',
					},
				],
			});
			setData({
				labels: ['Improvisation', 'Versatility', 'Repertoire', 'Instrumentation', 'Show'],
				datasets: [
					{
						label: 'Skills',
						data: [
							user!.user.skills.improvisation,
							user!.user.skills.versatility,
							user!.user.skills.repertoire,
							user!.user.skills.instrumentation,
							user!.user.skills.show,
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
	if (!user || !mockData || !data) return <div>LOading</div>;
	return (
		<div className={styles.userArtistsContainer}>
			<div className={styles.userCardInfo}>
				<div className={styles.cardInfo}>
					<UserCard
						setConnections={setConnections}
						instrument={user!.user.instrument}
						email={user!.user.email}
						image={mockData.image}
						avatar={mockData.avatar}
						name={mockData.name}
						job={mockData.job}
						stats={mockData.stats}
					/>
				</div>
			</div>
			<div className={styles.userStatsAndMap}>
				<div className={styles.userStats}>
					<UserStats data={data} />
					<Map
						zoom={11}
						center={{ lat: 10.96104, lng: -74.800957 }}
						className={styles.userMap}
						position={{ lat: 10.96104, lng: -74.800957 }}
					/>
				</div>
			</div>
			<div className={styles.allPosts}>
				{user!.user.posts.length > 0 ? (
					user!.user.posts.map((post: any) => (
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
	);
};

export default ArtistProfileClient;
