import { updateDailyQuestion } from '@/utils/apiUtils';
import { Modal } from '../Modal';

interface Props {
	show: boolean;
	onClose: () => void;
}

export const RankingModal = ({ show, onClose }: Props) => {
	const handleUpdateQuestionBank = () => {
		const today = new Date();
		Array.from({ length: 3 }).forEach((_, index) => {
			const thisDay = new Date(new Date().setDate(today.getDate() + index));
			updateDailyQuestion(thisDay);
		});
	};

	return (
		<Modal title={'過去問と正解率'} isOpen={show} onClose={onClose}>
			<div className="flex flex-col gap-4">
				<p>開発中、お楽しみに</p>
				<button onClick={handleUpdateQuestionBank}>test</button>
			</div>
		</Modal>
	);
};
