import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await context.params;
		const numericId = Number(id);
		if (!numericId) {
			return Response.json({ error: 'Invalid id' }, { status: 400 });
		}

		const body = await req.json();
		const doComplete = body.doComplete;

		const questions = await prisma.questions.findUnique({
			where: { id: numericId },
		});

		if (!questions) {
			return Response.json({ error: 'not found' }, { status: 404 });
		}

		const updated = await prisma.questions.update({
			where: { id: numericId },
			data: {
				challenge: questions.challenge + 1,
				...(doComplete ? { complete: questions.complete + 1 } : {}),
			},
		});

		return Response.json(updated, { status: 200 });
	} catch (err: any) {
		console.error(err);
		return Response.json(
			{
				error: 'Internal Server Error',
				detail: err?.message,
			},
			{ status: 500 }
		);
	}
}
