import PropType from 'prop-types';

const Stars = ({ votesAvg = 0, handleAddVote }) => {
    const numericAvg = Number(votesAvg) || 0;
    const stars = [];

    for (let i = 1; i <= 5; i++) {
        const isFilled = i <= Math.round(numericAvg);
        const starPath = isFilled ? '/star-fill.svg' : '/star-empty.svg';

        stars.push(
            <button
                type="button"
                key={i}
                onClick={() => handleAddVote(i)}
                className="p-0.5 hover:scale-125 transition-transform duration-150 focus:outline-none"
                title={`Votar con ${i} estrella${i > 1 ? 's' : ''}`}
            >
                <img
                    src={starPath}
                    alt={`${i} estrella`}
                    className="w-5 h-5 object-contain"
                />
            </button>
        );
    }

    return (
        <div className="inline-flex items-center gap-2">
            <div className="flex items-center gap-0.5">{stars}</div>
            <span className="text-xs font-semibold text-zinc-600">
                {numericAvg > 0 ? `${numericAvg.toFixed(1)} / 5` : 'Sin votos'}
            </span>
        </div>
    );
};

Stars.propTypes = {
    votesAvg: PropType.oneOfType([PropType.number, PropType.string]),
    handleAddVote: PropType.func.isRequired,
};

export default Stars;

