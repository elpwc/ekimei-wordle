import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	/* config options here */
	//output: 'export',
	images: { unoptimized: true },
	basePath: '/ekiwordle',
	//assetPrefix: '/simticket',
	compress: true,
};

export default nextConfig;
