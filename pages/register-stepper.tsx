import { useState } from 'react';
import { Stepper, Button, Group, Text, Center } from '@mantine/core';
import Layout from '../components/Layout';
import styles from '../styles/RegisterStepper.module.scss';
import UserMode from '../components/UserMode';
import Sliders from '../components/Sliders';
import { TuneUpProfilePhotos } from '../components/TuneUpProfilePhotos';
import StepperDone from '../components/StepperDone';
import SelectGenres from '../components/SelectGenres';
import { GetServerSideProps } from 'next';
import { loadGenres } from '../lib/loadGenres';
import { useAppSelector } from '../hooks/redux';
import { showNotification } from '@mantine/notifications';
import { IconBug } from '@tabler/icons';

interface RegisterStepperProps {
	genres: {
		title: string;
		instrumentation: string[];
		_id: string;
		createdAt: string;
		updatedAt: string;
	}[];
}

export default function RegisterStepper({ genres }: RegisterStepperProps) {
	const [active, setActive] = useState(0);
	const [isCustomer, setIsCustomer] = useState(false);
	const { genre, instrument, mode, avatar, background } = useAppSelector((state) => state.user);

	const nextStep = async () => {
		if (active === 1 && mode !== 'customer' && (!genre || !instrument)) {
			return showNotification({
				id: 'load-data-user',
				color: 'red',
				title: 'Please, complete the form.',
				message: 'Notification will close in 4 seconds, you can close this notification now',
				icon: <IconBug size={16} />,
				autoClose: 4000,
			});
		}
		if (active === 2 && (!avatar || !background)) {
			return showNotification({
				id: 'load-data-user',
				color: 'red',
				title: 'Please, select your avatar and background.',
				message: 'Notification will close in 4 seconds, you can close this notification now',
				icon: <IconBug size={16} />,
				autoClose: 4000,
			});
		}
		setActive((current) => (current < 3 ? current + 1 : current));
	};
	const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));
	return (
		<Layout title='Sillevon | Register'>
			<section className={styles.registerStepper}>
				<Stepper active={active} onStepClick={setActive} breakpoint='sm'>
					<Stepper.Step label='Mode' description='Select your mode' allowStepSelect={active > 0}>
						<div className={styles.contentStepper}>
							<Text
								component='span'
								align='center'
								variant='gradient'
								gradient={{ from: 'indigo', to: 'cyan', deg: 45 }}
								size={40}
								weight={700}
								style={{ fontFamily: 'Greycliff CF, sans-serif' }}
							>
								Select your user mode
							</Text>
							<UserMode setIsCustomer={setIsCustomer} />
						</div>
					</Stepper.Step>
					<Stepper.Step
						label={!isCustomer ? 'Favorites' : 'Skills'}
						description={!isCustomer ? 'Set your favorites genres' : 'Set your skills'}
						allowStepSelect={active > 1}
					>
						{mode === 'customer' ? <SelectGenres genres={genres} /> : <Sliders />}
					</Stepper.Step>
					<Stepper.Step
						label='Tune up'
						description='Tune up your profile'
						allowStepSelect={active > 2}
						className={styles.finalStep}
					>
						<Center>
							<Text
								component='span'
								align='center'
								variant='gradient'
								gradient={{ from: 'indigo', to: 'cyan', deg: 45 }}
								size={40}
								weight={700}
								style={{ fontFamily: 'Greycliff CF, sans-serif' }}
								className={styles.titleLastStep}
							>
								Select your photos and location
							</Text>
						</Center>
						<div className={styles.tuneUpProfilePhotos}>
							<TuneUpProfilePhotos />
						</div>
					</Stepper.Step>
					<Stepper.Completed>
						<StepperDone />
					</Stepper.Completed>
				</Stepper>
				{active !== 3 ? (
					<Group position='center' className={styles.stepper}>
						<Button variant='default' onClick={prevStep}>
							Back
						</Button>
						<Button onClick={nextStep}>Next step</Button>
					</Group>
				) : null}
			</section>
		</Layout>
	);
}

export const getServerSideProps: GetServerSideProps = async () => {
	const genres = await loadGenres();
	return {
		props: {
			genres: genres.data,
		},
	};
};
