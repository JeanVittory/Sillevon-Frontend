import { createStyles } from '@mantine/core';

export const useClientProfile = createStyles((theme, _params) => {
	const icon = 'icon';
	return {
		navContainer: {
			zIndex: 0,
			height: '100%',
		},
		header: {
			paddingBottom: theme.spacing.md,
			marginBottom: `${String(+theme.spacing.md * 1.5)}px`,
			borderBottom: `1px solid ${
				theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
			}`,
		},

		footer: {
			paddingTop: theme.spacing.md,
			marginTop: theme.spacing.md,
			borderTop: `1px solid ${
				theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
			}`,
		},

		link: {
			...theme.fn.focusStyles(),
			height: '100%',
			display: 'flex',
			alignItems: 'center',
			textDecoration: 'none',
			fontSize: theme.fontSizes.sm,
			color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7],
			padding: '1rem',
			borderRadius: theme.radius.sm,
			fontWeight: 500,
			width: '100%',
			border: 'none',

			'&:hover': {
				backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
				color: theme.colorScheme === 'dark' ? theme.white : theme.black,

				[`& .${icon}`]: {
					color: theme.colorScheme === 'dark' ? theme.white : theme.black,
				},
			},
		},

		linkIcon: {
			ref: icon,
			color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
			marginRight: theme.spacing.sm,
		},

		linkActive: {
			'&, &:hover': {
				backgroundColor: theme.fn.variant({
					variant: 'light',
					color: theme.primaryColor,
				}).background,
				color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
				[`& .${icon}`]: {
					color: theme.fn.variant({
						variant: 'light',
						color: theme.primaryColor,
					}).color,
				},
			},
		},
	};
});
