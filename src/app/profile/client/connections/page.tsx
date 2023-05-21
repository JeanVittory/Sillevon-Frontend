'use client';

import { useState, useEffect } from 'react';
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
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import Cookies from 'js-cookie';
import { IconCheck, IconTrash, IconBug } from '@tabler/icons-react';
import ClientLayout from '../../../../components/ClientLayout';
import Layout from '../../../../components/Layout';
import { Loader } from '../../../../components/Loader';
import { updateConnections, deleteConnection } from '../../../../lib/connections';
import { connectionService } from './service/connectionService';
import styles from '../../../../styles/ConnectionPage.module.scss';

export interface ConnectionsProps {
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
		contracts: {
			contractName: string;
			isAccepted: boolean;
			createdAt: string;
			schedule: Date;
			isPaid: boolean;
			rehearsalSchedule: [];
			price: number;
			_id: string;
			artist: {
				name: string;
				instrument: string;
			};
		}[];
	};
}

const jobColors: Record<string, string> = {
	active: 'blue',
	pending: 'pink',
};

export default function Connections() {
	const theme = useMantineTheme();
	const [user, setUser] = useState<ConnectionsProps>();
	const [connections, setConnections] = useState<any>();
	const [rows, setRows] = useState<any>();

	useEffect(() => {
		connectionService().then((response: any) => {
			setUser(response);
			setConnections(response.user.connections);
		});
	}, []);

	useEffect(() => {
		if (user) {
			const rows = connections.map((item: any) => (
				<tr key={item._id}>
					<td>
						<Group spacing='sm'>
							<Avatar size={30} src={item.userB.imagesDone.avatar} radius={30} />
							<Text size='sm' weight={500}>
								{item.userB.name}
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
							{item.userB.genre}
						</Anchor>
					</td>
					<td>
						<Text size='sm' color='dimmed'>
							{item.userB.price} /hr
						</Text>
					</td>
					<td>
						<Group spacing={0} position='right'>
							{!item.done && item.userA._id !== user!.user?._id ? (
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
	}, []);

	async function handleCheckClick(id: string) {
		const token = Cookies.get('sillusr');
		try {
			const connection = await updateConnections(true, id, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			const newConnections = connections.filter((item: any) => item._id !== id);
			newConnections.unshift(connection.data);
			setConnections(newConnections);
			showNotification({
				id: 'load-data-user',
				color: 'teal',
				title: 'Connection accepted',
				message: 'Notification will close in 4 seconds, you can close this notification now',
				icon: <IconCheck size={16} />,
				autoClose: 4000,
			});
		} catch {
			showNotification({
				id: 'load-data-user',
				color: 'red',
				title: 'Connection not accepted',
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
		<ClientLayout>
			<div className={styles.connectionsContainer}>
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
				<div>
					<ScrollArea>
						<Table sx={{ minWidth: 800 }} verticalSpacing='sm'>
							<thead>
								<tr>
									<th>Artist/Band</th>
									<th>Instrument</th>
									<th>Genre</th>
									<th>Price</th>
									<th />
								</tr>
							</thead>
							<tbody>{rows}</tbody>
						</Table>
					</ScrollArea>
				</div>
			</div>
		</ClientLayout>
	);
}
