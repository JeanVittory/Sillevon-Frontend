'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { openConfirmModal } from '@mantine/modals';
import { Button, Divider, Text, Accordion } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconCheck, IconBug } from '@tabler/icons-react';
import Cookies from 'js-cookie';
import { Loader } from '../../../../components/Loader';
import ClientLayout from '../../../../components/ClientLayout';
import { ConnectionsProps } from '../connections/page';
import { deleteContract } from '../../../../lib/contracts';
import { contractsUser } from './service/contracts';
import styles from '../../../../styles/ContractsPage.module.scss';

interface ContractsProps extends ConnectionsProps {}

export default function Contracts() {
	const router = useRouter();
	const token = Cookies.get('sillusr');
	const [namesOfContracts, setNamesOfContracts] = useState<string[]>([]);
	const [user, setUser] = useState<ContractsProps>();

	useEffect(() => {
		let prevName = 'name';
		if (user) {
			for (let i = 0; i < user.user.contracts.length; i++) {
				let nextName = user.user.contracts[i].contractName;
				if (nextName !== prevName) {
					setNamesOfContracts([...namesOfContracts, nextName]);
					prevName = nextName;
				}
			}
		}
	}, [user]);

	useEffect(() => {
		contractsUser().then((response: any) => {
			setUser(response);
		});
	}, []);

	const openModal = (contractId: string) =>
		openConfirmModal({
			title: 'Please confirm your action',
			children: (
				<Text size='sm'>
					Are you sure you want to delete the contract?. There are not refounds in case the contract does
					not finished yet.
				</Text>
			),
			labels: { confirm: 'Confirm', cancel: 'Cancel' },
			onCancel: () =>
				showNotification({
					id: 'Canceleddeletecontract',
					color: 'teal',
					title: 'Contract will stay in your profile',
					message: 'Notification will close in 4 seconds, you can close this notification now.',
					icon: <IconCheck size={16} />,
					autoClose: 4000,
				}),
			onConfirm: async () => {
				try {
					const res = await deleteContract(contractId, {
						headers: {
							Authorization: `Bearer ${token}`,
						},
					});
					const newContracts = namesOfContracts.filter((item) => item !== res.data.contractName);
					setNamesOfContracts(newContracts);
					showNotification({
						id: 'deletecontract',
						color: 'teal',
						title: 'Contract was deleted successfully',
						message: 'Notification will close in 4 seconds, you can close this notification now.',
						icon: <IconCheck size={16} />,
						autoClose: 4000,
					});
				} catch {
					showNotification({
						id: 'deletecontract',
						color: 'red',
						title: 'Contract could not been deleted',
						message: 'Notification will close in 4 seconds, you can close this notification now',
						icon: <IconBug size={16} />,
						autoClose: 4000,
					});
				}
			},
		});

	if (!user)
		return (
			<div className={styles.loader}>
				<Loader />
			</div>
		);

	return (
		<ClientLayout>
			<div className={styles.contractsContainer}>
				<div className={styles.headerContainers}>
					<Text
						component='span'
						align='center'
						variant='gradient'
						gradient={{ from: 'indigo', to: 'cyan', deg: 45 }}
						size={25}
						weight={700}
						style={{ fontFamily: 'Greycliff CF, sans-serif', marginRight: '20px' }}
					>
						Contracts
					</Text>
					<Button onClick={() => router.push('/stepper-contract')}>New contract</Button>
				</div>
				<Divider mt={20} mb={20} />
				<div>
					<Accordion variant='contained' radius='md'>
						{namesOfContracts.length > 0 ? (
							namesOfContracts.map((item) => {
								const currentContracts = user!.user.contracts.filter(
									(contract) => contract.contractName === item
								);
								const isInProccess = currentContracts.every((contract) => contract.isAccepted === true);
								const process = isInProccess ? 'ReadyToPay' : 'In process...';
								const isPaid = currentContracts.every((contract) => contract.isPaid === true);
								return (
									<Accordion.Item value={item} key={item}>
										<Accordion.Control>
											<Text>Name: {item}</Text>
											<Text>Status: {isPaid ? 'Done' : process}</Text>
										</Accordion.Control>
										<Accordion.Panel>
											<div className={styles.acordionContent}>
												<div className={styles.artistList}>
													<ul>
														{currentContracts.map((contract) => {
															return (
																<li key={contract._id}>
																	{contract.artist.name} - {contract.artist.instrument}
																</li>
															);
														})}
													</ul>
												</div>
												<div className={styles.infoContainerAcor}>
													<Text>Total price: ${currentContracts[0].price}</Text>
													{!isPaid && process === 'ReadyToPay' ? (
														<Button onClick={() => router.push(`/payment?name=${item}`)}>Go to pay</Button>
													) : null}
													<Button
														mt={10}
														color='red'
														variant='outline'
														onClick={() => openModal(currentContracts[0]._id)}
													>
														Delete
													</Button>
												</div>
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
			</div>
		</ClientLayout>
	);
}
