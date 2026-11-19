import PropTypes from 'prop-types';
import { QuestionCard } from './QuestionCard';

export const QuestionsListProfile = ({ questionsProfile = [] }) => {
    return questionsProfile && questionsProfile.length ? (
        <div className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {questionsProfile.map((questionProfile) => (
                    <div key={questionProfile.question_id}>
                        <QuestionCard question={questionProfile} />
                    </div>
                ))}
            </div>
        </div>
    ) : (
        <div className="text-zinc-500 text-sm py-8 text-center bg-white rounded-2xl border border-zinc-200">
            Todavía no has hecho ninguna consulta...
        </div>
    );
};

QuestionsListProfile.propTypes = {
    questionsProfile: PropTypes.array,
};

