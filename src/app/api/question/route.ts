import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';

/**
 * GET
 */
export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);

	const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 20;
	const stationId = searchParams.get('stationId') ? Number(searchParams.get('stationId')) : 0;
	const challenge = searchParams.get('challenge') ? Number(searchParams.get('challenge')) : 0;
	const complete = searchParams.get('complete') ? Number(searchParams.get('complete')) : 0;
	const showAt = searchParams.get('showAt') ? String(searchParams.get('showAt')) : new Date().toISOString();
	const maskedStationName = searchParams.get('maskedStationName');
	const orderBy = searchParams.get('orderBy'); // challenge | complete | date
	const asc = searchParams.get('asc') === 'asc' ? 'asc' : 'desc'; // asc | desc
	const page = searchParams.get('page') ? Math.max(Number(searchParams.get('page')), 0) : 0;

	const skip = page * limit;

	let questions = await prisma.questions.findMany({
		where: {
			deleted: false,
			...(stationId ? { stationId: Number(stationId) } : {}),
			...(maskedStationName ? { maskedStationName: maskedStationName } : {}),
			...(challenge ? { challenge: Number(challenge) } : {}),
			...(complete ? { complete: Number(complete) } : {}),
			...(showAt
				? {
						showAt: {
							gte: new Date(new Date(showAt).setHours(0, 0, 0, 0)),
							lt: new Date(new Date(showAt).setHours(24, 0, 0, 0)),
						},
				  }
				: {}),
		},
		orderBy: orderBy === 'challenge' ? { challenge: asc } : orderBy === 'complete' ? { complete: asc } : { showAt: asc },
		skip,
		take: limit,

		select: {
			id: true,
			stationId: true,
			challenge: true,
			complete: true,
			maskedStationName: true,
			showAt: true,
			createdAt: true,
		},
	});

	return Response.json(questions);
}
