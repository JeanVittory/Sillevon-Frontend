'use client';

import { GetServerSideProps } from 'next';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
	Avatar,
	Badge,
	Table,
	Group,
	Text,
	ActionIcon,
	Anchor,
	ScrollArea,
	useMantineTheme,
	UnstyledButton,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import Cookies from 'js-cookie';
import { IconCheck, IconTrash, IconBug, IconChevronLeft } from '@tabler/icons-react';
import { updateConnections, deleteConnection } from '../../../../lib/connections';
import { Loader } from '../../../../components/Loader';
import { connectionsArtistService } from './service/connections';
import styles from '../../../../styles/ConnectionsArtists.module.scss';

interface ConnectionsProps {
	user: {
		_id: string;
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

const jobColors: Record<string, string> = {
	active: 'blue',
	pending: 'pink',
};

export default function ConnectionClient() {
	const router = useRouter();
	const theme = useMantineTheme();
	const [connections, setConnections] = useState<any>();
	const [user, setUser] = useState<ConnectionsProps>();
	const [rows, setRows] = useState(null);

	useEffect(() => {
		connectionsArtistService().then((response) => {
			setUser(response.user);
			setConnections(response.user.connections);
		});
	}, []);

	useEffect(() => {
		if (connections?.length > 0) {
			const rows = connections.map((item: any) => (
				<tr key={item._id}>
					<td>
						<Group spacing='sm'>
							<Avatar size={30} src={item.userA.imagesDone.avatar} radius={30} />
							<Text size='sm' weight={500}>
								{item.userA.name}
							</Text>
						</Group>
					</td>

					<td>
						<Badge
							color={jobColors[item.done ? 'active' : 'pending']}
							variant={theme.colorScheme === 'dark' ? 'light' : 'outline'}
						>
							{item.done ? 'Active' : 'Pending'}
						</Badge>
					</td>
					<td>
						<Anchor<'a'> size='sm' href='#' onClick={(event) => event.preventDefault()}>
							{item.userA.genre}
						</Anchor>
					</td>
					<td>
						<Group spacing={0} position='right'>
							{!item.done || item?.userA?._id === user!?.user?._id ? (
								<ActionIcon onClick={() => handleCheckClick(item._id)}>
									<IconCheck size={16} stroke={1.5} />
								</ActionIcon>
							) : null}
							<ActionIcon color='red' onClick={() => handleDeleteClick(item._id)}>
								<IconTrash size={16} stroke={1.5} />
							</ActionIcon>
						</Group>
					</td>
				</tr>
			));
			setRows(rows);
		}
	}, [connections]);

	async function handleCheckClick(id: string) {
		const token = Cookies.get('sillusr');
		try {
			const connection = await updateConnections(true, id, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			const newConnections = connections!.filter((item: any) => {
				return item._id !== id;
			});
			newConnections.unshift(connection.data);
			setConnections(newConnections);
			showNotification({
				id: 'load-data-user',
				color: 'teal',
				title: 'Connection deleted',
				message: 'Notification will close in 4 seconds, you can close this notification now',
				icon: <IconCheck size={16} />,
				autoClose: 4000,
			});
		} catch (e) {
			showNotification({
				id: 'load-data-user',
				color: 'red',
				title: 'Connection not deleted',
				message: 'Notification will close in 4 seconds, you can close this notification now',
				icon: <IconBug size={16} />,
				autoClose: 4000,
			});
		}
	}

	async function handleDeleteClick(id: string) {
		const token = Cookies.get('sillusr');
		try {
			await deleteConnection(id, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			const newConnections = connections.filter((item: any) => item._id !== id);
			setConnections(newConnections);
			showNotification({
				id: 'load-data-user',
				color: 'teal',
				title: 'Connection deleted',
				message: 'Notification will close in 4 seconds, you can close this notification now',
				icon: <IconCheck size={16} />,
				autoClose: 4000,
			});
		} catch {
			showNotification({
				id: 'load-data-user',
				color: 'red',
				title: 'Connection not deleted',
				message: 'Notification will close in 4 seconds, you can close this notification now',
				icon: <IconBug size={16} />,
				autoClose: 4000,
			});
		}
	}

	if (!user || !connections)
		return (
			<div className={styles.loaderContainer}>
				<Loader />
			</div>
		);

	return (
		<div className={styles.connectionArtistsContainer}>
			<UnstyledButton mb={20} onClick={() => router.push('/profile/artists')}>
				<IconChevronLeft size={20} />
			</UnstyledButton>
			<Text
				component='span'
				align='center'
				variant='gradient'
				gradient={{ from: 'indigo', to: 'cyan', deg: 45 }}
				size={30}
				weight={700}
				style={{ fontFamily: 'Greycliff CF, sans-serif' }}
			>
				Connections
			</Text>
			<ScrollArea>
				<Table sx={{ minWidth: 400 }} verticalSpacing='sm'>
					<thead>
						<tr>
							<th>Users</th>
							<th>Status</th>
							<th />
						</tr>
					</thead>
					<tbody>{rows}</tbody>
				</Table>
			</ScrollArea>
		</div>
	);
}
