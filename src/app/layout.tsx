import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { GoogleAnalytics } from '@next/third-parties/google';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: '駅 - Wordle',
	description: '地図を見て真ん中にある駅の名前を当てるゲーム',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ja">
			<head>
				<link rel="icon" href="/icon?<generated>" type="image/<generated>" sizes="<generated>" />
				<meta name="google-adsense-account" content="ca-pub-1195280671714046" />
			</head>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				{children}
				<GoogleAnalytics gaId="G-5DHFBE584G" />
			</body>
		</html>
	);
}
