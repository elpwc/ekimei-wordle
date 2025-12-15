import JapanStations from '@/assets/japanStationsDataWithoutUnused.json';
import { ManualModal } from './modals/ManualModal';
import { useState } from 'react';
import { RankingModal } from './modals/RankingModal';

interface Props {
	currentStation: (typeof JapanStations)[0];
	maskedStationName: string;
}

export const Header = ({ currentStation, maskedStationName }: Props) => {
	const [showManual, setShowManual] = useState(false);
	const [showRanking, setShowRanking] = useState(false);
	return (
		<header className="w-full flex justify-between items-center shadow-md bg-[#f8f8f8] px-1">
			<nav>
				<button
					className="noborder text-sky-600 p-2!"
					onClick={() => {
						setShowManual(true);
					}}
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
						<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.496 6.033h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286a.237.237 0 0 0 .241.247zm2.325 6.443c.61 0 1.029-.394 1.029-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94 0 .533.425.927 1.01.927z" />
					</svg>
				</button>
			</nav>
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
			<nav>
				<button
					className="noborder text-emerald-500 p-2!"
					onClick={() => {
						setShowRanking(true);
					}}
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
						<path d="M1 11a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-3zm5-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V2z" />
					</svg>
				</button>
			</nav>
			<ManualModal show={showManual} onClose={() => setShowManual(false)} />
			<RankingModal show={showRanking} onClose={() => setShowRanking(false)} />
		</header>
	);
};
