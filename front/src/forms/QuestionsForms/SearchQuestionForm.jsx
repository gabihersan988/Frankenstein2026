import PropType from 'prop-types';

import { Link } from 'react-router-dom';

import { useState } from 'react';

const SearchForm = ({ setSearchParams, loading }) => {
    const [question_title, setQuestion_title] = useState('');
    const [technology, setTechnology] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const params = {};
        if (question_title.trim()) params.question_title = question_title.trim();
        if (technology.trim()) params.technology = technology.trim();
        setSearchParams(new URLSearchParams(params));
    };

    const handleClear = () => {
        setQuestion_title('');
        setTechnology('');
        setSearchParams(new URLSearchParams({}));
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-sm flex flex-col md:flex-row items-center gap-4 mb-8"
        >
            <div className="flex-1 w-full">
                <input
                    type="text"
                    id="question_title"
                    placeholder="🔍 Buscar por palabra clave en la pregunta..."
                    value={question_title}
                    onChange={(e) => setQuestion_title(e.target.value)}
                    className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#829821] focus:bg-white transition-all"
                />
            </div>

            <div className="w-full md:w-64">
                <input
                    type="text"
                    id="technology"
                    placeholder="🏷️ Tecnología (ej: React, Node)"
                    value={technology}
                    onChange={(e) => setTechnology(e.target.value)}
                    className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#829821] focus:bg-white transition-all"
                />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 md:flex-none px-5 py-2.5 bg-[#829821] hover:bg-[#96af25] text-white font-semibold rounded-xl text-sm shadow transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50"
                >
                    {loading ? 'Buscando...' : 'Buscar'}
                </button>
                {(question_title || technology) && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="px-3 py-2.5 text-zinc-400 hover:text-zinc-600 text-xs font-medium"
                        title="Limpiar filtros"
                    >
                        Limpiar
                    </button>
                )}
            </div>
        </form>
    );
};

// Validamos las props.
SearchForm.propTypes = {
    setSearchParams: PropType.func.isRequired,
    loading: PropType.bool.isRequired,
};

export default SearchForm;
