// eslint-disable-next-line no-unused-vars
import React from 'react';
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
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
  
  // Se houver um botão de busca, você pode testar o clique também
  const botaoBuscar = screen.getByText(/Buscar/i);
  fireEvent.click(botaoBuscar);
  
  // Espere pelos resultados se necessário
  await waitFor(() => {
    expect(screen.getByText(/Resultados para/i)).toBeInTheDocument();
  });
});

test("Adiciona e remove um livro dos favoritos", async () => {
  // Mock dos dados ou configurando o estado inicial
  render(<SearchBooks initialBooks={[{ id: "123", volumeInfo: { title: "React Testing" } }]} />);
  
  // Espere até que o elemento esteja disponível
  await waitFor(() => {
    expect(screen.getByText(/React Testing/i)).toBeInTheDocument();
  });
  
  // Agora interaja com os elementos
  const botaoFavorito = screen.getByText(/Favoritar/i);
  fireEvent.click(botaoFavorito);
  
  await waitFor(() => {
    expect(screen.getByText(/Remover dos Favoritos/i)).toBeInTheDocument();
  });
  
  fireEvent.click(screen.getByText(/Remover dos Favoritos/i));
  
  await waitFor(() => {
    expect(screen.getByText(/Favoritar/i)).toBeInTheDocument();
  });
});

test("Verifica se a paginação funciona corretamente", async () => {
  // Renderize com dados iniciais ou mock da API
  render(<SearchBooks initialBooks={[/* dados de exemplo */]} />);
  
  // Primeiro faça uma busca para que a paginação esteja disponível
  const input = screen.getByPlaceholderText(/Digite o nome do livro/i);
  const botaoBuscar = screen.getByText(/Buscar/i);
  
  fireEvent.change(input, {target: {value: "JavaScript"}});
  fireEvent.click(botaoBuscar);
  
  // Espere pelos elementos de paginação
  await waitFor(() => {
    expect(screen.getByText(/Próximo/i)).toBeInTheDocument();
  });
  
  const botaoProximo = screen.getByText(/Próximo/i);
  fireEvent.click(botaoProximo);
  
  await waitFor(() => {
    expect(screen.getByText(/Página 2/i)).toBeInTheDocument();
  });
});