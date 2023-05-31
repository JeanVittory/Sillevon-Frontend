import Layout from '../components/Layout';
import 'leaflet/dist/leaflet.css';
import '../styles/globals.scss';

export const metadata = {
	title: {
		default: 'Sillevon',
		template: '%s | Sillevon',
	},
	description: 'Music has never been so close to you',
	keywords: ['Music', 'Live Show', 'Sillevon', 'Music Service'],
	icons: {
		icon: '/next.svg',
	},
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html>
			<body>
				<Layout>{children}</Layout>
			</body>
		</html>
	);
}
