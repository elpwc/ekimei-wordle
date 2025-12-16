import { updateDailyQuestion } from '@/utils/apiUtils';
import { PrismaClient } from '@prisma/client/extension';

const prisma = new PrismaClient();

async function main() {
	console.log('Daily job start:', new Date().toISOString());

	const result = updateDailyQuestion();
	console.log(result);

	console.log('Daily job done');
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
