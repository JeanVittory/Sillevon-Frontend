import { createStyles } from '@mantine/core';

export const useFooterStyles = createStyles((theme) => {
	const paddingXlFooter = +theme.spacing.xl.split('r')[0];
	const paddingXsFooter = +theme.spacing.xs.split('r')[0];
	return {
		footer: {
			paddingTop: `${paddingXlFooter * 2}rem`,
			marginTop: `${paddingXlFooter * 4}rem`,
			backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
			borderTop: `1px solid ${
				theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
			}`,
		},

		logo: {
			maxWidth: 200,

			[theme.fn.smallerThan('sm')]: {
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
			},
		},

		description: {
			marginTop: 5,

			[theme.fn.smallerThan('sm')]: {
				marginTop: theme.spacing.xs,
				textAlign: 'center',
			},
		},

		inner: {
			display: 'flex',
			justifyContent: 'space-between',

			[theme.fn.smallerThan('sm')]: {
				flexDirection: 'column',
				alignItems: 'center',
			},
		},

		groups: {
			display: 'flex',
			flexWrap: 'wrap',

			[theme.fn.smallerThan('sm')]: {
				display: 'none',
			},
		},

		wrapper: {
			width: 160,
		},

		link: {
			display: 'block',
			color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[6],
			fontSize: theme.fontSizes.sm,
			paddingTop: 3,
			paddingBottom: 3,

			'&:hover': {
				textDecoration: 'underline',
			},
		},

		title: {
			fontSize: theme.fontSizes.lg,
			fontWeight: 700,
			fontFamily: `Greycliff CF, ${theme.fontFamily}`,
			marginBottom: `${paddingXsFooter / 2}rem`,
			color: theme.colorScheme === 'dark' ? theme.white : theme.black,
		},

		afterFooter: {
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: 'center',
			marginTop: theme.spacing.xl,
			paddingTop: theme.spacing.xl,
			paddingBottom: theme.spacing.xl,
			borderTop: `1px solid ${
				theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
			}`,

			[theme.fn.smallerThan('sm')]: {
				flexDirection: 'column',
			},
		},

		social: {
			[theme.fn.smallerThan('sm')]: {
				marginTop: theme.spacing.xs,
			},
		},

		sillevon: {
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
		},
	};
});
