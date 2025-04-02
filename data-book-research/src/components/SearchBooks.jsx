import { useEffect, useState } from "react";

const SearchBooks = () => {
    const [query, setQuery] = useState("");
    const [books, setBooks] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [showFavorites, setShowFavorites] = useState(false);
    const [page, setPage] = useState(0);
    const maxResults = 10;

    // carregar os favoritos do localstorage
    useEffect(() => {
        const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
        setFavorites(savedFavorites);
    }, []);

    // atualizar o localstorage dos favoritos
    useEffect(() => {
        localStorage.setItem("favorites", JSON.stringify(favorites));
    }, [favorites]);

    const handleSearch = async (e) => {
        const value = e.target.value;
        setQuery(value);
        setPage(0)
        
        if (value.lenght < 3) return;
        
        fetchBooks(value, 0);
    };

    const fetchBooks = async (searchQuery, startIndex) => {
        try {
            const response = await fetch(
                `https://www.googleapis.com/books/v1/volumes?q=${searchQuery}&startIndex=${startIndex}&maxResults=${maxResults}`
            );
            const data = await response.json();
            setBooks(data.items || []);
        } catch (error) {
            console.error("Erro ao buscar livros: ", error);
        }
    }

    const changePage = (newPage) => {
        const newStartIndex = newPage * maxResults;
        setPage(newPage);
        fetchBooks(query, newStartIndex);
    }

    const toggleFavorite = (book) => {
        if (favorites.some((fav) => fav.id === book.id)) {
            setFavorites(favorites.filter((fav) => fav.id !== book.id));
        } else {
            setFavorites([...favorites, book]);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-4 sm:p-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 text-blue-600">
                Buscador de Livros 📚
            </h1>

            {selectedBook ? (
                <div className="p-4 border rounded-lg shadow-md bg-white">
                    <h2 className="text-lg sm:text-2xl font-bold">{selectedBook.volumeInfo.title}</h2>
                    <p className="text-gray-600 mt-2">
                        <strong>Autor(es):</strong> {selectedBook.volumeInfo.authors?.join(", ") || "Desconhecido"}
                    </p>
                    <p className="text-gray-700 mt-2">
                        <strong>Descrição:</strong> {selectedBook.volumeInfo.description || "Sem descrição disponível"}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 mt-4">
                        <button
                            onClick={() => setSelectedBook(null)}
                            className="w-full sm:w-auto px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                        >
                            Voltar
                        </button>
                        <button
                            onClick={() => toggleFavorite(selectedBook)}
                            className={`w-full sm:w-auto px-4 py-2 rounded-lg transition ${
                                favorites.some((fav) => fav.id === selectedBook.id)
                                    ? "bg-red-600 text-white hover:bg-red-700"
                                    : "bg-green-600 text-white hover:bg-green-700"
                            }`}
                        >
                            {favorites.some((fav) => fav.id === selectedBook.id) ? "Remover dos favoritos" : "Favoritar"}
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <input
                        type="text"
                        value={query}
                        onChange={handleSearch}
                        placeholder="Digite o nome do Livro..."
                        className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <button
                        onClick={() => setShowFavorites(!showFavorites)}
                        className="mt-3 w-full sm:w-auto px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                    >
                        {showFavorites ? "Mostrar todos" : "Mostrar Favoritos"}
                    </button>

                    <div className="mt-4 space-y-3">
                        {(showFavorites ? favorites : books).map((book) => (
                            <div
                                key={book.id}
                                className="p-4 border rounded-lg shadow-md bg-white hover:shadow-lg transition cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
                                onClick={() => setSelectedBook(book)}
                            >
                                <div>
                                    <h2 className="text-lg font-semibold">{book.volumeInfo.title}</h2>
                                    <p className="text-gray-600">
                                        {book.volumeInfo.authors?.join(", ") || "Autor desconhecido"}
                                    </p>
                                </div>
                                {favorites.some((fav) => fav.id === book.id) && (
                                    <span className="text-red-500 text-xl">❤️</span>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
                        <button
                            onClick={() => changePage(page - 1)}
                            disabled={page === 0}
                            className={`w-full sm:w-auto px-4 py-2 rounded-lg ${
                                page === 0
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-blue-600 text-white hover:bg-blue-700 transition"
                            }`}
                        >
                            Anterior
                        </button>
                        <button
                            onClick={() => changePage(page + 1)}
                            className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            Próximo
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default SearchBooks;