import Layout from '../components/Layout';
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
