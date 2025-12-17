import prisma from '@/lib/prisma';
import { getMaskedStationName, getRandomStationId, getStationById } from './utils';
import JapanStations from '@/assets/japanStationsDataWithoutUnused.json';

export async function updateDailyQuestion(updateDate?: Date) {
	const setRandomQues = async (date: Date, stationId: number, maskedStationName: string, onDone: (doCreated: boolean) => void) => {
		let thisDaysQuestion = await prisma.questions.findMany({
			where: {
				deleted: false,
				showAt: {
					gte: new Date(date.setHours(0, 0, 0, 0)),
					lt: new Date(date.setHours(24, 0, 0, 0)),
				},
			},
			select: {
				id: true,
				showAt: true,
			},
		});

		if (thisDaysQuestion.length === 0) {
			const createData: any = {
				stationId,
				name: getStationById(stationId).name,
				maskedStationName,
				showAt: new Date(date.setHours(0, 0, 0, 0)),
			};

			const questions = await prisma.questions.create({
				data: createData,
			});

			onDone(true);
			return Response.json(questions);
		} else {
			onDone(false);
		}
	};

	if (updateDate) {
		const stationId1 = getRandomStationId();
		const stationInfo1 = getStationById(stationId1);
		const maskedStationName1 = getMaskedStationName(stationInfo1.name);

		const today = updateDate;
		setRandomQues(today, stationId1, maskedStationName1, (doCreated1) => {});
	} else {
		const stationId1 = getRandomStationId();
		const stationInfo1 = getStationById(stationId1);
		const maskedStationName1 = getMaskedStationName(stationInfo1.name);

		const today = new Date();
		setRandomQues(today, stationId1, maskedStationName1, (doCreated1) => {
			const stationId2 = getRandomStationId();
			const stationInfo2 = getStationById(stationId2);
			const maskedStationName2 = getMaskedStationName(stationInfo2.name);

			const tomorrow = new Date(today);
			tomorrow.setDate(tomorrow.getDate() + 1);
			setRandomQues(tomorrow, stationId2, maskedStationName2, (doCreated2) => {
				return [
					{
						date: today,
						stationId: stationId1,
						stationName: stationInfo1.name,
						maskedStationName: maskedStationName1,
						hasCreated: doCreated1,
					},
					{
						date: tomorrow,
						stationId: stationId2,
						stationName: stationInfo2.name,
						maskedStationName: maskedStationName2,
						hasCreated: doCreated2,
					},
				];
			});
		});
	}
}
