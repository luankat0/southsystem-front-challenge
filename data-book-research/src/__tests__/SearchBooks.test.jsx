import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { test, expect } from "@jest/globals";
import SearchBooks from "../components/SearchBooks";

test("Renderiza completamento o título", () => {
  render(<SearchBooks />);
  expect(screen.getByText(/Buscador de Livros/i)).toBeInTheDocument();
});

test("Permite o usuário digitar e buscar livros", async () => {
    render(<SearchBooks />);
    const input = screen.getByPlaceholderText(/Digite o nome do livro/i);

    fireEvent.change(input, {target: {value: "JavaScript"}});
    expect(input.value).toBe("JavaScript");
});

test("Adiciona e remove um livro dos favoritos", async () => {
    render(<SearchBooks />);
    
    const livro = { id: "123", volumeInfo: { title: "React Testing" } };
    fireEvent.click(screen.getByText(/React Testing/i));

    const botaoFavorito = screen.getByText(/Favoritar/i);
    fireEvent.click(botaoFavorito);
    expect(botaoFavorito.textContent).toBe("Remover dos Favoritos");

    fireEvent.click(botaoFavorito);
    expect(botaoFavorito.textContent).toBe("Favoritar");
});

test("Verifica se a paginação funciona corretamente", async () => {
    render(<SearchBooks />);
    
    const botaoProximo = screen.getByText(/Próximo/i);
    fireEvent.click(botaoProximo);

    expect(screen.getByText(/Página 2/i)).toBeInTheDocument();
});

