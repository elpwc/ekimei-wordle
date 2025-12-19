import { Modal } from '../Modal';
import { getQuestionsList, OrderType, updateQuestionAPI } from '@/utils/api';
import { useEffect, useState } from 'react';
import JapanStations from '@/assets/japanStationsDataWithoutUnused.json';
import { getStationById } from '@/utils/utils';
import { RingProgress } from '../RingProgress/RingProgress';

interface Props {
	show: boolean;
	onClose: () => void;
	onChallengeButtonOnClick: ({ stationId, maskedStationName }: { stationId: number; maskedStationName: string }) => void;
}

export const RankingModal = ({ show, onClose, onChallengeButtonOnClick }: Props) => {
	const [questionList, setQuestionList] = useState([]);

	useEffect(() => {
		getQuestionsList({
			before: new Date(new Date().setDate(new Date().getDate() + 1)),
			limit: 100,
			orderBy: OrderType.date,
			asc: false,
		}).then((data) => {
			setQuestionList(data || []);
		});
	}, []);

	const handleUpdateQuestionBank = () => {
		const today = new Date();
		Array.from({ length: 1000 }).forEach((_, index) => {
			const thisDay = new Date(new Date().setDate(today.getDate() + index));

			updateQuestionAPI(thisDay);
		});
	};

	return (
		<Modal title={'過去問と正解率'} isOpen={show} onClose={onClose}>
			<div className="flex flex-col gap-4 mb-60">
				{questionList.map((question: any, index: number) => {
					const stationInfo = getStationById(question.stationId);
					return (
						<div key={index} className="justify-between border-b border-gray-300 pb-2">
							<div className="flex gap-2 items-center">
								<p>
									{new Date(question.showAt).toLocaleDateString('ja-JP', {
										timeZone: 'UTC',
									})}
								</p>

								{index === 0 ? <p className="px-2 bg-blue-500 text-white text-[10px] rounded-[4px]">今日</p> : <></>}
							</div>
							<div className="grid grid-cols-10 justify-between items-center">
								<p className="col-span-6">{`${stationInfo.pref} ${question.maskedStationName}駅`}</p>

								{index === 0 ? (
									<p className="col-span-1 text-[12px]">統計中</p>
								) : (
									<p className="col-span-1">
										{question.complete && question.challenge ? Math.round((question.complete / question.challenge) * 100) : 0}%
										{/* ({question.complete || 0}/{question.challenge || 0}) */}
									</p>
								)}

								{index === 0 ? (
									<div></div>
								) : (
									<RingProgress
										className="col-span-1 w-4"
										progress={question.complete && question.challenge ? Math.round((question.complete / question.challenge) * 100) : 0}
										forecolor="green"
									/>
								)}
								{index === 0 ? (
									<div className="font-bold col-span-2 text-center text-sky-600 text-[12px] px-2 py-1">今日の駅</div>
								) : (
									<button
										className="col-span-2 text-[14px]"
										style={{ margin: 0 }}
										onClick={() => {
											onChallengeButtonOnClick({ stationId: question.stationId, maskedStationName: question.maskedStationName });
										}}
									>
										挑戦
									</button>
								)}
							</div>
						</div>
					);
				})}

				{/* <button onClick={handleUpdateQuestionBank}>test</button> */}
			</div>
		</Modal>
	);
};
