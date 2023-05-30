'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Accordion, Text, Button, UnstyledButton } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconCheck, IconBug, IconChevronLeft } from '@tabler/icons-react';
import Cookies from 'js-cookie';
import { Loader } from '../../../../components/Loader';
import { ConnectionsProps } from '../../client/connections/page';
import { acceptContract } from '../../../../lib/contracts';
import { contractsService } from './service/contracts';
import styles from '../../../../styles/ArtistsContracts.module.scss';

interface ContractsArtistsProps extends ConnectionsProps {}

export default function ContractsArtists() {
	const [user, setUser] = useState<ContractsArtistsProps>();
	const token = Cookies.get('sillusr');
	const router = useRouter();

	useEffect(() => {
		contractsService().then((response: any) => {
			setUser(response);
		});
	}, []);

	if (!user)
		return (
			<div>
				<Loader />
			</div>
		);

	return (
		<div className={styles.artistsContractsContainer}>
			<UnstyledButton mb={20} onClick={() => router.push('/profile/artists')}>
				<IconChevronLeft size={40} />
			</UnstyledButton>
			<Text
				component='span'
				align='center'
				variant='gradient'
				gradient={{ from: 'indigo', to: 'cyan', deg: 45 }}
				size={40}
				weight={700}
				style={{ fontFamily: 'Greycliff CF, sans-serif' }}
			>
				Contracts
			</Text>
			<Accordion variant='contained' radius='md'>
				{user.user.contracts.length > 0 ? (
					user.user.contracts.map((contract) => {
						const day = new Date(contract.schedule).getDate();
						const month = new Date(contract.schedule).getMonth() + 1;
						const year = new Date(contract.schedule).getFullYear();
						return (
							<Accordion.Item value={contract.contractName} key={contract._id}>
								<Accordion.Control>{contract.contractName}</Accordion.Control>
								<Accordion.Panel>
									<div className={styles.infoContract}>
										<Text>
											Date: {day} / {month} / {year}
										</Text>
										<Text>Rehearsals: {contract.rehearsalSchedule.length}</Text>
										<Button
											onClick={async () => {
												try {
													await acceptContract(contract._id, {
														headers: {
															Authorization: `Bearer ${token}`,
														},
													});
													showNotification({
														id: 'load-data-contract',
														color: 'teal',
														title: 'Contract was updated successfully',
														message: 'Notification will close in 4 seconds, you can close this notification now.',
														icon: <IconCheck size={16} />,
														autoClose: 4000,
													});
													router.push('/profile/artists');
												} catch {
													showNotification({
														id: 'load-data-contract',
														color: 'red',
														title: 'Contract could not been updated, try again',
														message: 'Notification will close in 4 seconds, you can close this notification now',
														icon: <IconBug size={16} />,
														autoClose: 4000,
													});
												}
											}}
										>
											Accept contract
										</Button>
									</div>
								</Accordion.Panel>
							</Accordion.Item>
						);
					})
				) : (
					<Text>There are not contracts</Text>
				)}
			</Accordion>
		</div>
	);
}
