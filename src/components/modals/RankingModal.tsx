import { Modal } from '../Modal';

interface Props {
	show: boolean;
	onClose: () => void;
}

export const RankingModal = ({ show, onClose }: Props) => {
	return (
		<Modal title={'過去問と正解率'} isOpen={show} onClose={onClose}>
			<div className="flex flex-col gap-4">
				<p>開発中、お楽しみに</p>
			</div>
		</Modal>
	);
};
