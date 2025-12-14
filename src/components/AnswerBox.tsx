import { Answer } from '@/utils/types';
import JapanStations from '@/assets/japanStationsDataWithoutUnused.json';
import { getEmojiFromDegree } from '@/utils/utils';

interface Props {
	answer: Answer;
}

export const AnswerBox = ({ answer }: Props) => {
	const station = JapanStations[answer.stationId];
	return (
		<div className="rounded-[4px] w-full p-0 grid grid-cols-4 items-center gap-0.5">
			<div className=" flex flex-col items-center justify-center gap-0.5">
				<p className="answerBoxBorder w-full text-center answerText answerTextSmall">{station.pref}</p>
				<p className="answerBoxBorder w-full text-center answerText answerTextSmall">{station.muni}</p>
			</div>
			<div className=" flex flex-col items-center justify-center gap-0.5">
				<p className="answerBoxBorder w-full text-center answerText answerTextSmall">{station.com.length > 6 ? station.com.substring(0, 6) + '..' : station.com}</p>
				<p className="answerBoxBorder w-full text-center answerText answerTextSmall">{station.line}</p>
			</div>
			<div className="answerBoxBorder flex flex-col items-center justify-center">
				<p className="text-center text-[14px] font-extrabold">{station.name}駅</p>
			</div>
			<div className="answerBoxBorder flex flex-col items-center justify-center">
				<p>{Math.round(answer.distanceKm)}km</p>
				<div>{getEmojiFromDegree(answer.bearingDeg)}</div>
			</div>
		</div>
	);
};
