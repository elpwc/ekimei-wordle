'use client';

import { getOSMData } from '@/utils/getOSMData';
import { renderOSM } from '@/utils/mapRenderer';
import { useEffect, useRef, useState } from 'react';
import { distanceAndBearing, getMaskedStationName, getRandomStationId, getShareText, getStationById, wordleCompare } from '@/utils/utils';
import { useHint } from '@/components/HintProvider';
import { Answer, AnswerStatus } from '@/utils/types';
import { AnswerList } from '@/components/AnswerList';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import dynamic from 'next/dynamic';
import { getQuestionsList, updateQuestionChallengeInfo } from '@/utils/api';
import JapanStations from '@/assets/japanStationsDataWithoutUnused.json';

const ParticlesBg = dynamic(() => import('particles-bg'), {
	ssr: false,
});

enum GameStatus {
	Playing,
	Correct,
	Failed,
}

export default function HomePage() {
	const hint = useHint();

	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	const [tips, setTips] = useState('');
	const [currentStationId, setCurrentStationId] = useState<number>(-1);
	const [answers, setAnswers] = useState<Answer[]>([]);
	const [maskedStationName, setMaskedStationName] = useState('');
	const [textboxText, setTextboxText] = useState('');
	const [candidateAnswers, setCandidate] = useState<(typeof JapanStations)[0][]>([]);
	const [gameStatus, setGameStatus] = useState(GameStatus.Playing);

	// デイリーidの保存とデイリーなのかの確認用、デイリーでない（もう一局の時）と-1と設定
	const [dailyId, setDailyId] = useState(-1);

	const [openURL, setOpenURL] = useState('');

	const maxAnswerCount = 6;

	useEffect(() => {
		if (openURL !== '') {
			window.open(openURL);
			setOpenURL('');
		}
	}, [openURL]);

	enum GameStartType {
		/** デイリー */
		IdFromServer,
		/** ランダム */
		RandomId,
		/** 指定されたstationId */
		SpecifiedId,
		/** デイリーすでに完成、ふたたび開けるとき */
		DailyHasBeenPlayed,
	}

	const initGame = async (
		{ gameStartType, stationId, maskedStationName }: { gameStartType?: GameStartType; stationId?: number; maskedStationName?: string } = {
			gameStartType: GameStartType.IdFromServer,
		}
	) => {
		const ctx = canvasRef.current?.getContext('2d');
		ctx?.clearRect(0, 0, canvasRef.current?.width || 1000, canvasRef.current?.height || 1000);
		if (gameStartType !== GameStartType.DailyHasBeenPlayed) {
			setAnswers([]);
			setGameStatus(GameStatus.Playing);
		}
		setTextboxText('');
		setCandidate([]);
		setDailyId(-1);

		let i = 0;
		const interval1 = setInterval(() => {
			setTips('駅情報取得中' + '.'.repeat(i));
			i++;
			if (i >= 4) {
				i = 1;
			}
		}, 200);

		let todaysStationId = getRandomStationId();
		let todaysStationMaskedName = getMaskedStationName(getStationById(todaysStationId).name);
		if (gameStartType === GameStartType.IdFromServer || gameStartType === GameStartType.DailyHasBeenPlayed) {
			const todaysStationInfos = await getQuestionsList({ showAt: new Date() });
			//console.log(todaysStationInfos);

			if (todaysStationInfos.length > 0) {
				todaysStationId = todaysStationInfos[0].stationId;
				todaysStationMaskedName = todaysStationInfos[0].maskedStationName;
				setDailyId(todaysStationInfos[0].id);
			}
		} else if (gameStartType === GameStartType.SpecifiedId) {
			todaysStationId = stationId ?? 0;
			todaysStationMaskedName = maskedStationName ?? 'ERROR';
		}

		const randomStation = getStationById(todaysStationId); //getStationById(getRandomStationId()];
		//console.log(randomStation);
		setCurrentStationId(todaysStationId);
		setMaskedStationName(todaysStationMaskedName);

		if (gameStartType === GameStartType.DailyHasBeenPlayed) {
			const answerTexts = localStorage.getItem('dailyAnswers')?.split(',');
			answerTexts?.forEach((answerText) => {
				handleAnswer(answerText, todaysStationId);
			});
		}

		const radius = 2500;
		// 新杉田 coastline test
		// const lat = 35.3868;
		// const lon = 139.619435;

		// // border test
		// const lat = 36.13706;
		// const lon = 139.694089;
		// metro test, (京都駅)
		// const lat = 34.987180;
		// const lon = 135.757427;
		// tram aerialway
		//  const lat = 32.759619;
		//  const lon = 129.865758;
		// cablecar
		// const lat = 35.631685;
		// const lon = 139.2685;
		clearInterval(interval1);

		const getData = () => {
			i = 0;
			const interval2 = setInterval(() => {
				setTips('地図情報をOpenStreetMapから取得中' + '.'.repeat(i));
				i++;
				if (i >= 4) {
					i = 0;
				}
			}, 300);

			const lat = randomStation.coord[1];
			const lon = randomStation.coord[0];

			getOSMData(
				{ lat, lon },
				radius,
				(data) => {
					//console.log(data);
					if (canvasRef.current && ctx) {
						clearInterval(interval2);
						setTips('地図レンダリング中...');
						ctx?.clearRect(0, 0, canvasRef.current?.width || 1000, canvasRef.current?.height || 1000);
						renderOSM(canvasRef.current, ctx, data, { center: { lat, lon }, scale: 10000 }, true, randomStation, todaysStationMaskedName);
						setTips('');
					}
				},
				(errorText) => {
					clearInterval(interval2);
					setTips('地図情報の取得に失敗しました。1秒後にリトライします。(' + errorText + ')');
					setTimeout(() => {
						getData();
					}, 1000);
				}
			);
		};

		getData();
	};

	useEffect(() => {
		const dailySitu = localStorage.getItem('daily');
		if (dailySitu === null) {
			initGame();
		} else {
			if (dailySitu === 'passed') {
				setGameStatus(GameStatus.Correct);
			} else if (dailySitu === 'failed') {
				setGameStatus(GameStatus.Failed);
			}

			initGame({ gameStartType: GameStartType.DailyHasBeenPlayed });
		}
	}, []);

	// useEffect(() => {
	// 	console.log(answers);
	// }, [answers]);

	const handleAnswer = (answer: string, correctStationId: number = currentStationId) => {
		let closestDistance = 500000;
		let closestId = -1;

		const currentStation = getStationById(correctStationId);

		JapanStations.forEach((station, index) => {
			if (station.name === answer) {
				const { distanceKm } = distanceAndBearing(currentStation.coord as [number, number], station.coord as [number, number]);
				if (distanceKm <= closestDistance) {
					closestDistance = distanceKm;
					closestId = index;
				}
			}
		});
		const findIndex = closestId;
		if (answer !== currentStation.name) {
			// x
			if (findIndex === -1) {
				// 存在しない
				hint('top', 'この駅名は存在しないのよ', 'darkred', 1000);
			} else {
				// 不正解やが、存在
				// console.log(answer.length, maxAnswerCount, gameStatus)
				if (answers.length + 1 >= maxAnswerCount) {
					setGameStatus(GameStatus.Failed);
					hint('top', `正解は「${currentStation.name}駅」でしたー`, 'orange');
					if (dailyId !== -1) {
						updateQuestionChallengeInfo(dailyId, false).then(() => {});
						//console.log(answers);
						localStorage.setItem(
							'dailyAnswers',
							[
								...answers.map((ans) => {
									return ans.answerText;
								}),
								getStationById(findIndex).name,
							].join(',')
						);
						localStorage.setItem('daily', 'failed');
					}
				}

				const { distanceKm, bearingDeg } = distanceAndBearing(currentStation.coord as [number, number], getStationById(findIndex).coord as [number, number]);

				setAnswers((prev) => [
					...prev,
					{
						answerText: getStationById(findIndex).name,
						stationId: findIndex,
						distanceKm,
						bearingDeg,
						status: [AnswerStatus.OutOfPref],
						isPrefTheSame: currentStation.pref === getStationById(findIndex).pref,
						isMuniTheSame: currentStation.muni === getStationById(findIndex).muni,
						isComTheSame: currentStation.com === getStationById(findIndex).com,
						isLineTheSame: currentStation.line === getStationById(findIndex).line,
						isStationTheSame: currentStation.name === getStationById(findIndex).name,
						prefCharStatus: wordleCompare(getStationById(findIndex).pref ?? '', currentStation.pref ?? ''),
						muniCharStatus: wordleCompare(getStationById(findIndex).muni ?? '', currentStation.muni ?? ''),
						comCharStatus: wordleCompare(getStationById(findIndex).com, currentStation.com),
						lineCharStatus: wordleCompare(getStationById(findIndex).line, currentStation.line),
						stationCharStatus: wordleCompare(getStationById(findIndex).name, currentStation.name),
					} as Answer,
				]);
			}
		} else {
			// 正解~
			const { distanceKm, bearingDeg } = distanceAndBearing(currentStation.coord as [number, number], getStationById(findIndex).coord as [number, number]);

			setAnswers((prev) => [
				...prev,
				{
					answerText: getStationById(findIndex).name,
					stationId: findIndex,
					distanceKm,
					bearingDeg,
					status: [AnswerStatus.OutOfPref],
					isPrefTheSame: currentStation.pref === getStationById(findIndex).pref,
					isMuniTheSame: currentStation.muni === getStationById(findIndex).muni,
					isComTheSame: currentStation.com === getStationById(findIndex).com,
					isLineTheSame: currentStation.line === getStationById(findIndex).line,
					isStationTheSame: currentStation.name === getStationById(findIndex).name,
					prefCharStatus: wordleCompare(getStationById(findIndex).pref ?? '', currentStation.pref ?? ''),
					muniCharStatus: wordleCompare(getStationById(findIndex).muni ?? '', currentStation.muni ?? ''),
					comCharStatus: wordleCompare(getStationById(findIndex).com, currentStation.com),
					lineCharStatus: wordleCompare(getStationById(findIndex).line, currentStation.line),
					stationCharStatus: wordleCompare(getStationById(findIndex).name, currentStation.name),
				} as Answer,
			]);

			setGameStatus(GameStatus.Correct);
			if (dailyId !== -1) {
				updateQuestionChallengeInfo(dailyId, true).then(() => {});
				//console.log(answers);
				localStorage.setItem(
					'dailyAnswers',
					[
						...answers.map((ans) => {
							return ans.answerText;
						}),
						getStationById(findIndex).name,
					].join(',')
				);
				localStorage.setItem('daily', 'passed');
			}
			hint('top', '🎊正解！🎉', 'green');
		}
	};

	return (
		<>
			<Header
				currentStation={getStationById(currentStationId)}
				maskedStationName={maskedStationName}
				onChallengeButtonOnClick={({ stationId, maskedStationName }: { stationId: number; maskedStationName: string }) => {
					initGame({ gameStartType: GameStartType.SpecifiedId, stationId, maskedStationName });
				}}
			/>
			<main className="flex justify-center pt-2 mb-2">
				<div className="max-w-[400px] px-2">
					<div className="border-0 border-[#cccccc] w-fit bg-white shadow-md">
						<canvas className="w-full" ref={canvasRef} width={400} height={300} />
					</div>
					<p className="text-[#555] text-[16px]">{tips}</p>

					<AnswerList answers={answers} maxAnswerCount={maxAnswerCount} />

					{gameStatus === GameStatus.Correct || gameStatus === GameStatus.Failed ? (
						<>
							{gameStatus === GameStatus.Failed ? (
								<>
									<div className="my-4 px-4 py-2 rounded-xl bg-lime-200 shadow-md">
										<p>⭕正解は、</p>
										<div>
											<p className=" w-full text-center answerText answerTextSmall">{getStationById(currentStationId).com + ' ' + getStationById(currentStationId).line}</p>
											<p className="text-center text-[20px] font-extrabold">{getStationById(currentStationId).name}駅</p>
											<p className=" w-full text-center answerText answerTextSmall">{getStationById(currentStationId).pref + ' ' + getStationById(currentStationId).muni}</p>
										</div>
										<p className="w-full text-right">でした！</p>
									</div>
								</>
							) : (
								<></>
							)}
							<div className="flex flex-col gap-2 pt-4">
								<button
									className="w-full primary green py-4! flex items-center justify-center gap-2"
									onClick={() => {
										navigator.clipboard
											.writeText(getShareText(answers, getStationById(currentStationId)?.pref + ' ' + maskedStationName + '駅？', maxAnswerCount))
											.then(() => hint('top', 'コピーしました！'))
											.catch((err) => hint('top', 'コピーできませんでした...', 'red', 2000));
									}}
								>
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
										<path d="M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5z" />
									</svg>
									結果をシェア～♬
								</button>
								<button
									className="w-full primary py-4! flex items-center justify-center gap-2 bg-[#4caf50]! hover:bg-[#237127]!"
									onClick={() => {
										initGame({ gameStartType: GameStartType.RandomId });
									}}
								>
									もう一局！
								</button>
								<div className="flex gap-2">
									<button
										className="w-full flex items-center justify-center gap-2"
										onClick={() => {
											setOpenURL(
												`https://www.google.com/maps?q=${getStationById(currentStationId).name}駅@${getStationById(currentStationId).coord[1]},${
													getStationById(currentStationId).coord[0]
												}`
											);
										}}
									>
										<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
											<path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
										</svg>
										Google Map
									</button>
									<button
										className="w-full flex items-center justify-center gap-2"
										onClick={() => {
											setOpenURL(`https://ja.wikipedia.org/wiki/${getStationById(currentStationId).name}駅`);
										}}
									>
										<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
											<path
												fillRule="evenodd"
												d="M8.835 3.003c.828-.006 2.688 0 2.688 0l.033.03v.288c0 .08-.045.12-.133.12-.433.02-.522.063-.68.29-.087.126-.258.393-.435.694l-1.52 2.843-.043.089 1.858 3.801.113.031 2.926-6.946c.102-.28.086-.478-.044-.595-.132-.114-.224-.18-.563-.195l-.275-.014a.161.161 0 0 1-.096-.035.1.1 0 0 1-.046-.084v-.289l.042-.03h3.306l.034.03v.29c0 .078-.045.117-.133.117-.433.02-.754.113-.962.281a1.64 1.64 0 0 0-.488.704s-2.691 6.16-3.612 8.208c-.353.672-.7.61-1.004-.019A224.05 224.05 0 0 1 8.044 8.81c-.623 1.285-1.475 3.026-1.898 3.81-.411.715-.75.622-1.02.019-.45-1.065-1.131-2.519-1.817-3.982-.735-1.569-1.475-3.149-1.943-4.272-.167-.4-.293-.657-.412-.759-.12-.1-.368-.16-.746-.18C.069 3.429 0 3.395 0 3.341v-.303l.034-.03c.615-.003 3.594 0 3.594 0l.034.03v.288c0 .08-.05.118-.15.118l-.375.016c-.322.013-.483.11-.483.288 0 .083.034.217.109.4.72 1.753 3.207 6.998 3.207 6.998l.091.023 1.603-3.197-.32-.71L6.24 5.095s-.213-.433-.286-.577l-.098-.196c-.387-.771-.411-.82-.865-.88-.137-.017-.208-.035-.208-.102v-.304l.041-.03h2.853l.075.024v.303c0 .069-.05.104-.15.104l-.206.03c-.523.04-.438.254-.09.946l1.057 2.163 1.17-2.332c.195-.427.155-.534.074-.633-.046-.055-.202-.144-.54-.158l-.133-.015a.159.159 0 0 1-.096-.034.099.099 0 0 1-.045-.085v-.288l.041-.03Z"
											/>
										</svg>
										Wikipedia
									</button>
								</div>
							</div>
						</>
					) : (
						<>
							<div className="flex items-center sticky bottom-0 bg-white mt-3">
								<div className="w-full border-2 border-r-0 border-[#ccc] flex text-[20px] p-2 rounded-l-sm">
									<input
										className="w-full outline-0"
										type="text"
										placeholder="？"
										value={textboxText}
										onChange={(e) => {
											const text = e.target.value;
											//if (text.length > 0) {
											const max = 20;
											let count = 0;
											let tempCandidate = [];
											tempCandidate = JapanStations.filter((station) => {
												const judge = station.pref === getStationById(currentStationId).pref && station.name.includes(text);
												if (judge) {
													count++;
												}
												return count <= max && judge;
											});
											if (count < max) {
												tempCandidate = [
													...tempCandidate,
													...JapanStations.filter((station) => {
														const judge = station.pref === getStationById(currentStationId).pref && (station.com.includes(text) || station.line.includes(text));
														if (judge) {
															count++;
														}
														return count <= max && judge;
													}),
												];
											}
											if (count < max) {
												tempCandidate = [
													...tempCandidate,
													...JapanStations.filter((station) => {
														const judge = station.pref !== getStationById(currentStationId).pref && station.name.includes(text);
														if (judge) {
															count++;
														}
														return count <= max && judge;
													}),
												];
											}
											if (count < max) {
												tempCandidate = [
													...tempCandidate,
													...JapanStations.filter((station) => {
														const judge = station.pref !== getStationById(currentStationId).pref && (station.com.includes(text) || station.line.includes(text));
														if (judge) {
															count++;
														}
														return count <= max && judge;
													}),
												];
											}
											setCandidate(tempCandidate);
											//}
											setTextboxText(text);
										}}
										onKeyDown={(e) => {
											//console.log(e)
											if (e.key === 'Enter') {
												handleAnswer(textboxText);
												setTextboxText('');
											}
										}}
									/>
									<span className="font-extrabold">駅</span>
								</div>
								<button
									className={'primary w-fit hover:bg-teal-600!' + (textboxText.length === 0 ? ' disabled' : '')}
									style={{ height: 'min-content', padding: '8px 10px', borderRadius: '0 16px 16px 0', backgroundColor: textboxText.length === 0 ? '#adadad' : '#009689' }}
									onClick={() => {
										handleAnswer(textboxText);
										setTextboxText('');
									}}
								>
									<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
										<path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z" />
									</svg>
								</button>
							</div>
							<p className="text-[10px] text-[#888]">　思いつかん？駅名・会社名・線路名を入れると下に候補が出ますよ～</p>

							<div className="flex flex-wrap gap-2 mt-3">
								{candidateAnswers.map((candidate, index) => {
									return (
										<div
											key={candidate.com + candidate.line + candidate.name + index}
											className="bg-amber-100 shadow-md px-2 py-1 mt-0.5 flex flex-col cursor-pointer transition-all hover:bg-amber-200 hover:mt-0 hover:mb-0.5"
											onClick={() => {
												handleAnswer(candidate.name);
											}}
										>
											<p className="text-[8px]">{candidate.com.length > 6 ? candidate.com.substring(0, 6) + '..' : candidate.com}</p>
											<p className="text-[14px] font-extrabold">{candidate.name}駅</p>
										</div>
									);
								})}
							</div>
						</>
					)}
				</div>
			</main>
			<Footer />
			{gameStatus === GameStatus.Correct && <ParticlesBg num={10} type="ball" bg={true} />}
		</>
	);
}
