import { Answer } from '@/utils/types';
import { AnswerBox } from './AnswerBox';
import './Answer.css';

interface Props {
	answers: Answer[];
	maxAnswerCount: number;
}

export const AnswerList = ({ answers, maxAnswerCount }: Props) => {
	return (
		<div className="flex flex-col gap-2 mt-3">
			{answers.map((answer, index) => {
				return <AnswerBox key={'answer_' + index} answer={answer} />;
			})}
			{Array.from({ length: maxAnswerCount - answers.length }).map((_i, index) => {
				return (
					<div key={'blank_' + index} className="bg-[#e5eaeabd] rounded-[4px] w-full px-2 py-2 backdrop-blur-[8px]">
						{'　'}
					</div>
				);
			})}
		</div>
	);
};
