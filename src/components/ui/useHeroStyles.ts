import { createStyles } from '@mantine/core';

export const useHeroStyles = createStyles((theme) => {
	const paddingBottomContainerDesktop = +theme.spacing.xl.split('r')[0] * 6;
	const paddingBottomContainerMobile = +theme.spacing.xl.split('r')[0] * 3;
	const marginTopControlDesktop = +theme.spacing.xl.split('r')[0] * 1.5;

	return {
		hero: {
			position: 'relative',
			backgroundImage: 'url(HeroImg.webp)',
			backgroundSize: 'cover',
			backgroundPosition: 'center',
		},

		container: {
			height: 900,
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'flex-end',
			alignItems: 'flex-start',
			paddingBottom: `${paddingBottomContainerDesktop}rem`,
			zIndex: 1,
			position: 'relative',

			[theme.fn.smallerThan('sm')]: {
				height: 500,
				paddingBottom: `${paddingBottomContainerMobile}rem`,
			},
		},

		title: {
			color: theme.white,
			fontSize: 60,
			fontWeight: 900,
			lineHeight: 1.1,

			[theme.fn.smallerThan('sm')]: {
				fontSize: 40,
				lineHeight: 1.2,
			},

			[theme.fn.smallerThan('xs')]: {
				fontSize: 28,
				lineHeight: 1.3,
			},
		},

		description: {
			color: theme.white,
			maxWidth: 600,

			[theme.fn.smallerThan('sm')]: {
				maxWidth: '100%',
				fontSize: theme.fontSizes.sm,
			},
		},

		control: {
			marginTop: `${marginTopControlDesktop}rem`,

			[theme.fn.smallerThan('sm')]: {
				width: '100%',
			},
		},
	};
});
