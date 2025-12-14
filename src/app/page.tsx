'use client';

import { Suspense } from 'react';
import HomePage from './Homepage';
import { HintProvider } from '@/components/HintProvider';

export default function Home() {
	return (
		<Suspense>
			<HintProvider>
				<HomePage />
			</HintProvider>
		</Suspense>
	);
}
