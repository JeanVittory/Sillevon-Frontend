'use client';

import { Bars } from 'react-loader-spinner';
import styles from '../styles/Loader.module.scss';

export const Loader = () => (
	<div className={styles.loader}>
		<Bars color='black' width={15} height={15} />
	</div>
);
