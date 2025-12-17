import { updateDailyQuestion } from '@/utils/apiUtils';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
	const body = await req.json();

	const updated = await updateDailyQuestion(body.showAt !== undefined ? new Date(body.showAt) : undefined);
  console.log('updateQuestion result:', updated);
	return Response.json(updated);
}
