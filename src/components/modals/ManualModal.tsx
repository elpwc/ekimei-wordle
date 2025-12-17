import Image from 'next/image';
import { AnswerBox } from '../AnswerBox';
import { Modal } from '../Modal';
import exampleQuestion from '@/assets/example.png';
import { Divider } from '../Divider';

const example = [
	{
		answerText: '井川',
		stationId: 5053,
		distanceKm: 244.95028796256574,
		bearingDeg: 2.244825756426849,
		status: [0],
		isPrefTheSame: false,
		isMuniTheSame: false,
		isComTheSame: false,
		isLineTheSame: false,
		isStationTheSame: false,
		prefCharStatus: [false, false, true],
		muniCharStatus: [false, false, true],
		comCharStatus: [false, false, false, false, false],
		lineCharStatus: [false, false, true],
		stationCharStatus: [false, true],
	},
	{
		answerText: '音威子府',
		stationId: 378,
		distanceKm: 1050.6888611866957,
		bearingDeg: 308.10799785793114,
		status: [0],
		isPrefTheSame: false,
		isMuniTheSame: false,
		isComTheSame: false,
		isLineTheSame: false,
		isStationTheSame: false,
		prefCharStatus: [false, false, false],
		muniCharStatus: [false, false, false, false, false],
		comCharStatus: [true, true, false, false, false],
		lineCharStatus: [false, false, false, true],
		stationCharStatus: [false, false, false, false],
	},
	{
		answerText: '栗東',
		stationId: 6156,
		distanceKm: 23.65060928911212,
		bearingDeg: 100.87889905405603,
		status: [0],
		isPrefTheSame: true,
		isMuniTheSame: false,
		isComTheSame: true,
		isLineTheSame: false,
		isStationTheSame: false,
		prefCharStatus: [true, true, true],
		muniCharStatus: [false, false, true],
		comCharStatus: [true, true, true, true, true],
		lineCharStatus: [false, false, false, false, true],
		stationCharStatus: [false, false],
	},
	{
		answerText: '安曇川',
		stationId: 6178,
		distanceKm: 0,
		bearingDeg: -1,
		status: [0],
		isPrefTheSame: true,
		isMuniTheSame: true,
		isComTheSame: true,
		isLineTheSame: true,
		isStationTheSame: true,
		prefCharStatus: [true, true, true],
		muniCharStatus: [true, true, true],
		comCharStatus: [true, true, true, true, true],
		lineCharStatus: [true, true, true],
		stationCharStatus: [true, true, true],
	},
];

interface Props {
	show: boolean;
	onClose: () => void;
}

export const ManualModal = ({ show, onClose }: Props) => {
	return (
		<Modal title={'🎈説明'} isOpen={show} onClose={onClose}>
			<div className="flex flex-col gap-4 text-[13px]">
				<p>
					<span className="font-extrabold">駅-Wordle</span>は地図を見て真ん中にある駅の名前を当てるゲームです。
				</p>
				<p>毎日ランダムに全国の現存駅から出題されます。回答は最大6回までです。</p>
				<p>
					入力欄に答えを入力し、
					<button
						className={'primary w-fit hover:bg-teal-600!'}
						style={{ height: 'min-content', padding: '4px 5px', borderRadius: '0 10px 10px 0', backgroundColor: '#009689' }}
						onClick={() => {}}
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
							<path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z" />
						</svg>
					</button>
					をクリックするか、候補から選ぶか、<span className="border-3 p-0.5 border-t-blue-100 border-l-blue-100 border-b-blue-300 border-r-blue-300 bg-blue-200">Enter</span>
					を押すと、答えが正解かどうかが表示されます。
					<br />
					<span className="text-[9px] text-[#555]">出題範囲は、国土交通省国土数値情報ダウンロードサイトの鉄道時系列データ2024年度（令和6年度）版に基づいています</span>
				</p>
				<div>
					<p>地図の凡例は以下となります：</p>
					<div className="flex flex-col gap-4 pl-4 py-2">
						<div>
							<p>JR在来線</p>
							<div className="flex">
								{Array.from({ length: 5 }).map((_, i) => (
									<div key={i} className="border-1 border-black h-fit flex">
										<div className=" w-6 h-1 bg-black"></div>
										<div className=" w-6 h-1 bg-white"></div>
									</div>
								))}
							</div>
						</div>
						<div>
							<p>JR新幹線</p>
							<div className="flex">
								{Array.from({ length: 5 }).map((_, i) => (
									<div key={i} className="border-1 border-[#037771] h-fit flex">
										<div className=" w-6 h-1 bg-[#037771]"></div>
										<div className=" w-6 h-1 bg-white"></div>
									</div>
								))}
							</div>
						</div>
						<div>
							<p>
								私鉄線<span className="text-[10px]">（地下鉄含まず）</span>
							</p>
							<div className="flex">
								{Array.from({ length: 15 }).map((_, i) => (
									<div key={i} className="h-fit flex items-center">
										<div className=" w-3.5 h-0.5 bg-black"></div>
										<div className=" w-0.5 h-1.5 bg-black"></div>
									</div>
								))}
							</div>
						</div>
						<div>
							<p>地下鉄</p>
							<div className="flex">
								<div className=" w-60 h-0.5 bg-[#1f7197]"></div>
							</div>
						</div>
						<div>
							<p>ライトレール</p>
							<div className="flex">
								<div className=" w-60 h-0.5 bg-[#068862]"></div>
							</div>
						</div>
						<div>
							<p>路面電車</p>
							<div className="flex">
								{Array.from({ length: 12 }).map((_, i) => (
									<div key={i} className="h-fit flex items-center">
										<div className=" w-3.5 h-0.5 bg-[#64099e]"></div>
										<div className=" w-1.5 h-1.5 bg-[#64099e]"></div>
									</div>
								))}
							</div>
						</div>
						<div>
							<p>ケーブルカー・ロープウェイ</p>
							<div className="flex">
								{Array.from({ length: 12 }).map((_, i) => (
									<div key={i} className="h-fit flex items-center">
										<div className=" w-3.5 h-0.5 bg-black"></div>
										<div className=" w-1.5 h-1.5 bg-black"></div>
									</div>
								))}
							</div>
						</div>
						<div>
							<p>自動車道</p>
							<div className="flex">
								<div className=" w-60 h-0.5 bg-[#f57c00]"></div>
							</div>
						</div>
						<div>
							<p>都道府県境</p>
							<div className="flex">
								{Array.from({ length: 7 }).map((_, i) => (
									<div key={i} className="h-fit flex items-center">
										<div className="mr-1.5 w-3.5 h-0.5 bg-black"></div>
										<div className="mr-0.5 w-0.5 h-0.5 bg-black"></div>
										<div className="mr-1.5 w-0.5 h-0.5 bg-black"></div>
									</div>
								))}
							</div>
						</div>
						<div>
							<p>市区町村境</p>
							<div className="flex">
								{Array.from({ length: 8 }).map((_, i) => (
									<div key={i} className="h-fit flex items-center">
										<div className="mr-1.5 w-3.5 h-0.5 bg-black"></div>
										<div className="mr-1.5 w-0.5 h-0.5 bg-black"></div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
				<Divider />
				<div className="flex flex-col items-center mb-10">
					<p className="text-lg font-bold">例題</p>
					<Image className="py-4" src={exampleQuestion} alt="Example Question" width={300} height={200} />
					<div className="flex flex-col gap-4">
						<div>
							<AnswerBox answer={example[1]} />
							<p className="p-2">答えの会社名と線路名には、正解と同じ文字である「JR」「線」が含まれています、でも南西に1051㎞も離れていて結構遠いですね</p>
						</div>
						<div>
							<AnswerBox answer={example[0]} />
							<p className="p-2">答えた駅名には正解にも含まれている漢字「川」があります。また、都道府県名・市区町村名・線路名のそれぞれに、正解と共通する文字が1文字ずつ含まれています</p>
						</div>
						<div>
							<AnswerBox answer={example[2]} />
							<p className="p-2">おめでとう～　正解と同じ都道府県・会社名です。成功に一歩近づきましたね！</p>
						</div>
						<div>
							<AnswerBox answer={example[3]} />
							<p className="p-2">🎉正解！！</p>
						</div>
					</div>
				</div>
			</div>
		</Modal>
	);
};
