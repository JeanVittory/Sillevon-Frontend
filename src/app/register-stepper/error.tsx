'use client';
import styles from '../../styles/ErrorRegisterStepper.module.scss';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
	return (
		<div className={styles.container}>
			<h2>Something went wrong!</h2>
			<p>{error.message}</p>
			<button aria-label='try again' onClick={() => reset()}>
				Try again
			</button>
		</div>
	);
}
