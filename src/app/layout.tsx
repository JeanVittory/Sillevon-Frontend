import Layout from '../components/Layout';
import 'leaflet/dist/leaflet.css';
import '../styles/globals.scss';

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html>
			<body>
				<Layout>{children}</Layout>
			</body>
		</html>
	);
}
