import { useEffect, useState } from "react";

const SearchBooks = () => {
    const [query, setQuery] = useState("");
    const [books, setBooks] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [showFavorites, setShowFavorites] = useState(false);

    useEffect(() => {
        const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
        setFavorites(savedFavorites);
    }, []);

    useEffect(() => {
        localStorage.setItem("favorites", JSON.stringify(favorites));
    }, [favorites]);

    const handleSearch = async (e) => {
        const value = e.target.value;
        setQuery(value);

        if (value.lenght < 3) return;

        try {
            const response = await fetch(
                `https://www.googleapis.com/books/v1/volumes?q=${value}&maxResults=10`
            );
            const data = await response.json();

            setBooks(data.items || []);
        } catch (error) {
            console.error("Erro ao buscar livros: ", error);
        }
    };

    const toggleFavorite = (book) => {
        if (favorites.some((fav) => fav.id === book.id)) {
            setFavorites(favorites.filter((fav) => fav.id !== book.id));
        } else {
            setFavorites([...favorites, book]);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
                Buscador de Livros 📚
            </h1>
            {selectedBook ? (
                <div className="p-6 border rounded-lg shadow-md bg-white">
                    <h2 className="text-2xl font-bold">{selectedBook.volumeInfo.title}</h2>
                    <p className="text-gray-600 mt-2">
                        <strong>Autor(es):</strong> {selectedBook.volumeInfo.authors?.join(", ") || "Desconhecido"}
                    </p>
                    <p className="text-gray-700 mt-2">
                        <strong>Descrição:</strong> {selectedBook.volumeInfo.description || "Sem descrição disponível"}
                    </p>
                    <div className="flex gap-4 mt-4">
                        <button
                            onClick={() => setSelectedBook(null)}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg houver:bg-blue-700 transition"
                        >
                            Voltar
                        </button>
                        <button
                            onClick={() => toggleFavorite(selectedBook)}
                            className={`px-4 py-2 rounded-lg transition ${
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
                        className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                    >
                        {showFavorites ? "Mostrar todos" : "Mostrar Favoritos"}
                    </button>

                    <div className="mt-6 space-y-4">
                        {(showFavorites ? favorites : books).map((book) => (
                            <div
                                key={book.id}
                                className="p-4 border rounded-lg shadow-md bg-white hover:shadow-lg transition cursor-pointer flex justify-between items-center"
                                onClick={() => setSelectedBook(book)}
                            >
                                <div>
                                    <h2 className="text-lg font-semibold">{book.volumeInfo.title}</h2>
                                    <p className="text-gray-600">
                                        {book.volumeInfo.authors?.join(", ") || "Autor desconhecido"}
                                    </p>
                                </div>
                                {favorites.some((fav) => fav.id === book.id) && (
                                    <span className="text-red-500 text-x1">❤️</span>
                                )}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default SearchBooks;