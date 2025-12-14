import JapanStations from '@/assets/japanStationsDataWithoutUnused.json';

interface Props {
	currentStation: (typeof JapanStations)[0];
	maskedStationName: string;
}

export const Header = ({ currentStation, maskedStationName }: Props) => {
	return (
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
	);
};
