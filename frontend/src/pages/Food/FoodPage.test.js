import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import FoodPage from "./FoodPage";
import { useCart } from "../../hooks/useCart";
import * as foodService from "../../services/foodService";
import { QueryClient, QueryClientProvider } from "react-query"; // Import necessary react-query components
import "@testing-library/jest-dom";

// Mock the necessary modules
jest.mock("../../hooks/useCart");
jest.mock("../../services/foodService", () => ({
  getById: jest.fn(),
}));
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("FoodPage", () => {
  const mockAddToCart = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    useCart.mockReturnValue({ addToCart: mockAddToCart });
    require("react-router-dom").useNavigate.mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderWithQueryClient = (ui) => {
    const queryClient = new QueryClient();
    return render(
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    );
  };

  test("When food is not found", async () => {
    foodService.getById.mockResolvedValue(null);

    renderWithQueryClient(
      <MemoryRouter>
        <FoodPage />
      </MemoryRouter>
    );

    expect(await screen.findByText("Food Not Found!")).toBeInTheDocument();
  });

  test("renders food details and handles add to cart", async () => {
    const mockFood = {
      id: 1,
      name: "Pizza",
      imageUrl: "/images/pizza.jpg",
      favorite: true,
      stars: 4,
      origins: ["Italy"],
      tags: ["Fast Food", "Cheese"],
      cookTime: 20,
      price: 15,
    };
    foodService.getById.mockResolvedValue(mockFood);

    renderWithQueryClient(
      <MemoryRouter>
        <FoodPage />
      </MemoryRouter>
    );

    // Check if food details are rendered correctly
    expect(await screen.findByText(mockFood.name)).toBeInTheDocument();
    expect(screen.getByAltText(mockFood.name)).toHaveAttribute(
      "src",
      mockFood.imageUrl
    );
    expect(screen.getByText("❤")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
    expect(screen.getByText("Italy")).toBeInTheDocument();

    // Simulate adding to cart
    fireEvent.click(screen.getByText("Add To Cart"));
    expect(mockAddToCart).toHaveBeenCalledWith(mockFood);
    expect(mockNavigate).toHaveBeenCalledWith("/cart");
  });

  test("displays loading state", () => {
    foodService.getById.mockReturnValue(new Promise(() => {})); // Mock a pending promise

    renderWithQueryClient(
      <MemoryRouter>
        <FoodPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
});
