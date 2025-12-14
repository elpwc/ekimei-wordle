import { Answer } from '@/utils/types';
import JapanStations from '@/assets/japanStationsDataWithoutUnused.json';
import { getDistanceBorderColor, getEmojiFromDegree } from '@/utils/utils';

interface Props {
	answer: Answer;
}

export const AnswerBox = ({ answer }: Props) => {
	const station = JapanStations[answer.stationId];
	return (
		<div className="rounded-[4px] w-full p-0 grid grid-cols-12 grid- items-center gap-0.5 bg-[#ffffff11] backdrop-blur-[8px]">
			<div className="col-span-3 flex flex-col items-center justify-center gap-0.5">
				<p className={'answerBoxBorder w-full text-center answerText answerTextSmall' + (answer.isPrefTheSame ? ' correct' : answer.prefCharStatus.includes(true) ? ' halfcorrect' : '')}>
					<AnswerBoxText text={station.pref ?? ''} status={answer.prefCharStatus} />
				</p>
				<p className={'answerBoxBorder w-full text-center answerText answerTextSmall' + (answer.isMuniTheSame ? ' correct' : answer.muniCharStatus.includes(true) ? ' halfcorrect' : '')}>
					<AnswerBoxText text={station.muni ?? ''} status={answer.muniCharStatus} />
				</p>
			</div>
			<div className="col-span-4 flex flex-col items-center justify-center gap-0.5">
				<p className={'answerBoxBorder w-full text-center answerText answerTextSmall' + (answer.isComTheSame ? ' correct' : answer.comCharStatus.includes(true) ? ' halfcorrect' : '')}>
					<AnswerBoxText text={station.com.length > 6 ? station.com.substring(0, 6) + '..' : station.com} status={answer.comCharStatus} />
				</p>
				<p className={'answerBoxBorder w-full text-center answerText answerTextSmall' + (answer.isLineTheSame ? ' correct' : answer.lineCharStatus.includes(true) ? ' halfcorrect' : '')}>
					<AnswerBoxText text={station.line} status={answer.lineCharStatus} />
				</p>
			</div>
			<div
				className={
					'col-span-3 answerBoxBorder flex flex-col items-center justify-center' + (answer.isStationTheSame ? ' correct' : answer.stationCharStatus.includes(true) ? ' halfcorrect' : '')
				}
			>
				<p className="text-center text-[14px] font-extrabold">
					<AnswerBoxText text={station.name + '駅'} status={answer.stationCharStatus} />
				</p>
			</div>
			<div className={'col-span-2 answerBoxBorder flex flex-col items-center justify-center'} style={{ borderColor: getDistanceBorderColor(answer.distanceKm) }}>
				<p>{Math.round(answer.distanceKm)}km</p>
				<div>{getEmojiFromDegree(answer.bearingDeg)}</div>
			</div>
		</div>
	);
};

const AnswerBoxText = ({ text, status }: { text: string; status: boolean[] }) => {
	const statusToColor = (status: boolean) => {
		if (status) {
			return '#1d9222';
		} else {
			return 'black';
		}
	};
	//console.log(status);
	return text.split('').map((char, index) => (
		<span
			key={index}
			className=""
			style={{
				color: statusToColor(status[index]),
			}}
		>
			{char}
		</span>
	));
};
