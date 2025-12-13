'use client';

import { Suspense } from 'react';
import HomePage from './Homepage';

export default function Home() {
	return (
		<Suspense>
			<HomePage />
		</Suspense>
	);
}
