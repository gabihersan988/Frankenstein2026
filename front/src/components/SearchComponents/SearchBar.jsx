import { useState, useRef, useEffect } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const { VITE_BASE_URL } = import.meta.env;

export const SearchBar = () => {
    const [input, setInput] = useState('');
    const [results, setResults] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchData = (value) => {
        fetch(`${VITE_BASE_URL}/search`)
            .then((response) => response.json())
            .then((json) => {
                const searchArray = json.search || [];
                let filteredResults = [];

                searchArray.forEach((searchItem) => {
                    if (searchItem.projects) {
                        const filteredProjects = searchItem.projects.filter((project) =>
                            project.project_title?.toLowerCase().includes(value.toLowerCase())
                        );
                        filteredResults = filteredResults.concat(
                            filteredProjects.map((project) => ({
                                type: 'project',
                                ...project,
                            }))
                        );
                    }

                    if (searchItem.questions) {
                        const filteredQuestions = searchItem.questions.filter((question) =>
                            question.question_title?.toLowerCase().includes(value.toLowerCase())
                        );
                        filteredResults = filteredResults.concat(
                            filteredQuestions.map((question) => ({
                                type: 'question',
                                ...question,
                            }))
                        );
                    }

                    if (searchItem.companies) {
                        const filteredCompanies = searchItem.companies.filter((company) =>
                            company.company_name?.toLowerCase().includes(value.toLowerCase())
                        );
                        filteredResults = filteredResults.concat(
                            filteredCompanies.map((company) => ({
                                type: 'company',
                                ...company,
                            }))
                        );
                    }
                });

                setResults(filteredResults);
                setIsOpen(true);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const handleChange = (value) => {
        setInput(value);
        if (value.trim()) {
            fetchData(value);
        } else {
            setResults([]);
            setIsOpen(false);
        }
    };

    const handleClear = () => {
        setInput('');
        setResults([]);
        setIsOpen(false);
    };

    return (
        <div ref={containerRef} className="relative w-full max-w-xs">
            <div className="flex items-center gap-2 bg-zinc-900/90 text-white border border-zinc-700/80 rounded-xl px-3 py-1.5 focus-within:border-[#829821] focus-within:ring-1 focus-within:ring-[#829821] transition-all">
                <FaSearch className="text-[#829821] text-xs shrink-0" />
                <input
                    type="text"
                    className="bg-transparent text-xs text-zinc-100 placeholder-zinc-400 focus:outline-none w-full"
                    placeholder="Buscar proyectos, dudas..."
                    value={input}
                    onFocus={() => {
                        if (input.trim() && results.length > 0) setIsOpen(true);
                    }}
                    onChange={(e) => handleChange(e.target.value)}
                />
                {input && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="text-zinc-400 hover:text-white p-0.5 text-xs transition-colors"
                    >
                        <FaTimes />
                    </button>
                )}
            </div>

            {isOpen && input.trim() && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-zinc-200 overflow-hidden z-50 max-h-72 overflow-y-auto">
                    {results.length > 0 ? (
                        <div className="divide-y divide-zinc-100">
                            {results.map((result, index) => (
                                <div key={index}>
                                    {result.type === 'project' && (
                                        <Link
                                            to={`/project/${result.project_id}`}
                                            onClick={handleClear}
                                            className="flex items-start gap-2.5 p-3 hover:bg-zinc-50 transition-colors text-left group"
                                        >
                                            <span className="text-xs font-semibold px-2 py-0.5 bg-[#829821]/15 text-[#6c7f1a] rounded-md shrink-0 mt-0.5">
                                                🎨 Proyecto
                                            </span>
                                            <span className="text-xs font-medium text-zinc-800 group-hover:text-zinc-900 truncate">
                                                {result.project_title}
                                            </span>
                                        </Link>
                                    )}

                                    {result.type === 'question' && (
                                        <Link
                                            to={`/question/${result.question_id}`}
                                            onClick={handleClear}
                                            className="flex items-start gap-2.5 p-3 hover:bg-zinc-50 transition-colors text-left group"
                                        >
                                            <span className="text-xs font-semibold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md shrink-0 mt-0.5">
                                                💬 Pregunta
                                            </span>
                                            <span className="text-xs font-medium text-zinc-800 group-hover:text-zinc-900 truncate">
                                                {result.question_title}
                                            </span>
                                        </Link>
                                    )}

                                    {result.type === 'company' && (
                                        <div className="flex items-start gap-2.5 p-3 hover:bg-zinc-50 transition-colors text-left">
                                            <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md shrink-0 mt-0.5">
                                                🏢 Empresa
                                            </span>
                                            <span className="text-xs font-medium text-zinc-800 truncate">
                                                {result.company_name}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-4 text-center text-xs text-zinc-500">
                            No se encontraron resultados
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

