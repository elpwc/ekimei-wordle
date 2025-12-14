'use client';

import { getOSMData } from '@/utils/getOSMData';
import { renderOSM } from '@/utils/mapRenderer';
import { useEffect, useRef, useState } from 'react';
import JapanStations from '@/assets/japanStationsDataWithoutUnused.json';
import { distanceAndBearing, getEmojiFromDegree, getMaskedStationName } from '@/utils/utils';
import { useHint } from '@/components/HintProvider';
import { Answer, AnswerStatus } from '@/utils/types';

export default function HomePage() {
	const hint = useHint();

	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	const [tips, setTips] = useState('');
	const [currentStation, setCurrentStation] = useState<(typeof JapanStations)[0]>({ name: '', com: '', line: '', exist: true, coord: [141.331919, 43.070748], pref: '', muni: '札幌市' });
	const [answers, setAnswers] = useState<Answer[]>([]);
	const [maskedStationName, setMaskedStationName] = useState('');
	const [textboxText, setTextboxText] = useState('');
	const [candidateAnswers, setCandidate] = useState<(typeof JapanStations)[0][]>([]);

	const maxAnswerCount = 6;

	useEffect(() => {
		setTips('駅情報取得中...');
		const stationAmount = JapanStations.length;
		const randomStation = JapanStations[Math.round(Math.random() * stationAmount)];
		console.log(randomStation);
		setCurrentStation(randomStation);
		setMaskedStationName(getMaskedStationName(randomStation?.name ?? ''));
		const radius = 3000;
		// 新杉田 coastline test
		// const lat = 35.3868;
		// const lon = 139.619435;

		// // border test
		// const lat = 36.13706;
		// const lon = 139.694089;

		setTips('地図情報取得中...');
		const lat = randomStation.coord[1];
		const lon = randomStation.coord[0];
		getOSMData({ lat, lon }, radius, (data) => {
			console.log(data);
			const ctx = canvasRef.current?.getContext('2d');
			if (canvasRef.current && ctx) {
				setTips('地図レンダリング中...');
				renderOSM(canvasRef.current, ctx, data, { center: { lat, lon }, scale: 10000 }, true);
				setTips('');
			}
		});
	}, []);

	const handleAnswer = (answer: string) => {
		if (answer !== currentStation.name) {
			// x
			const findIndex = JapanStations.findIndex((station) => {
				return station.name === answer;
			});
			if (findIndex === -1) {
				// 存在しない
				hint('top', 'この駅名は存在しないのよ', 'darkred', 1000);
			} else {
				// 不正解やが、存在
				const { distanceKm, bearingDeg } = distanceAndBearing(currentStation.coord as [number, number], JapanStations[findIndex].coord as [number, number]);

				setAnswers((prev) => [
					...prev,
					{
						answerText: textboxText,
						stationId: findIndex,
						distanceKm,
						bearingDeg,
						status: [AnswerStatus.OutOfPref],
						isPrefTheSame: currentStation.pref === JapanStations[findIndex].pref,
						isMuniTheSame: currentStation.muni === JapanStations[findIndex].muni,
						isComTheSame: currentStation.com === JapanStations[findIndex].com,
						isLineTheSame: currentStation.line === JapanStations[findIndex].line,
					} as Answer,
				]);
			}
		} else {
			// 正解~
		}
	};

	return (
		<>
			<header className="w-full flex justify-between shadow-md bg-[#f8f8f8]">
				<nav></nav>
				<div className="flex flex-col items-center">
					<p className="text-[30px] font-extrabold">
						<span>{currentStation?.pref + ' '}</span>
						<span className="text-[#f44336]" style={{ fontSize: currentStation?.name.length > 6 ? '20px' : 'auto' }}>
							{maskedStationName}
						</span>
						駅？
					</p>
					<p className="text-[10px] font-extrabold">
						elpwc.com/<span className="text-[#f44336]">EKI</span>wordle
					</p>
				</div>
				<nav></nav>
			</header>
			<main className="flex justify-center pt-2 mb-40">
				<div className="max-w-[400px]">
					<div className="border-0 border-[#cccccc] w-fit  shadow-md">
						<canvas ref={canvasRef} width={400} height={300} />
					</div>
					<p className="text-[#555] text-[16px]">{tips}</p>
					<div className="flex flex-col gap-2 mt-3">
						{answers.map((answer, index) => {
							const station = JapanStations[answer.stationId];
							return (
								<div key={'answer_' + index} className="rounded-[4px] w-full p-0 grid grid-cols-4 items-center gap-0.5">
									<div className=" flex flex-col items-center justify-center gap-0.5">
										<p className="answerBoxBorder w-full text-center answerText answerTextSmall">{station.pref}</p>
										<p className="answerBoxBorder w-full text-center answerText answerTextSmall">{station.muni}</p>
									</div>
									<div className=" flex flex-col items-center justify-center gap-0.5">
										<p className="answerBoxBorder w-full text-center answerText answerTextSmall">{station.com.length > 6 ? station.com.substring(0, 6) + '..' : station.com}</p>
										<p className="answerBoxBorder w-full text-center answerText answerTextSmall">{station.line}</p>
									</div>
									<div className="answerBoxBorder flex flex-col items-center justify-center">
										<p className="text-center">{station.name}駅</p>
									</div>
									<div className="answerBoxBorder flex flex-col items-center justify-center">
										<p>{Math.round(answer.distanceKm)}km</p>
										<div>{getEmojiFromDegree(answer.bearingDeg)}</div>
									</div>
								</div>
							);
						})}
						{Array.from({ length: maxAnswerCount - answers.length }).map((_i, index) => {
							return (
								<div key={'blank_' + index} className="bg-[#e5eaea] rounded-[4px] w-full px-2 py-0">
									{'　'}
								</div>
							);
						})}
					</div>
					<div className="flex items-center">
						<div className="w-full border-2 border-r-0 border-[#ccc] flex text-[20px] my-3 p-2 rounded-l-sm">
							<input
								className="w-full outline-0"
								type="text"
								placeholder="?"
								value={textboxText}
								onChange={(e) => {
									const text = e.target.value;
									if (text.length > 0) {
										const max = 10;
										let count = 0;
										setCandidate(
											JapanStations.filter((station) => {
												if (station.pref === currentStation.pref && station.name.includes(text)) {
													count++;
												}
												return count <= max && station.pref === currentStation.pref && station.name.includes(text);
											})
										);
									}
									setTextboxText(text);
								}}
							/>
							<span className="font-extrabold">駅</span>
						</div>
						<button
							className={'primary w-fit hover:bg-teal-600!' + (textboxText.length === 0 ? ' disabled' : '')}
							style={{ height: 'min-content', padding: '8px 10px', borderRadius: '0 16px 16px 0', backgroundColor: textboxText.length === 0 ? '#adadad' : '#009689' }}
							onClick={() => {
								handleAnswer(textboxText);
							}}
						>
							<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
								<path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z" />
							</svg>
						</button>
					</div>
					<div className="flex flex-wrap gap-2">
						{candidateAnswers.map((candidate) => {
							return (
								<div
									key={candidate.com + candidate.line + candidate.name}
									className="bg-amber-100 shadow-md px-2 py-1 mt-0.5 flex flex-col cursor-pointer transition-all hover:bg-amber-200 hover:mt-0 hover:mb-0.5"
									onClick={() => {
										setTextboxText(candidate.name);
										handleAnswer(candidate.name);
									}}
								>
									<p className="text-[8px]">{candidate.com.length > 6 ? candidate.com.substring(0, 6) + '..' : candidate.com}</p>
									<p className="text-[14px] font-extrabold">{candidate.name}駅</p>
								</div>
							);
						})}
					</div>
					<div className="flex flex-col gap-4">
						<button className="w-full">結果をシェア</button>
						<div className="flex gap-4">
							<button className="w-full">Google Map</button>
							<button className="w-full">Wikipedia</button>
						</div>
					</div>
				</div>
			</main>
		</>
	);
}
