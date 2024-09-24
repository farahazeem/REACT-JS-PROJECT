import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import HomePage from "./HomePage";
import * as foodService from "../../services/foodService";
import "@testing-library/jest-dom";

jest.mock("../../services/foodService", () => ({
  getAll: jest.fn(),
  getAllByTag: jest.fn(),
  getAllTags: jest.fn(),
  search: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
  useNavigate: jest.fn(),
}));

describe("HomePage", () => {
  beforeEach(() => {
    foodService.getAllTags.mockResolvedValue([
      { name: "FastFood", count: 2 },
      { name: "Pizza", count: 2 },
      { name: "Lunch", count: 3 },
    ]);
    foodService.getAll.mockResolvedValue([
      {
        id: "1",
        name: "Pizza Pepperoni",
        price: 10,
        origins: ["Italy"],
        tags: ["FastFood", "Pizza", "Lunch"],
      },
      {
        id: "2",
        name: "Meatball",
        price: 20,
        origins: ["Sweden"],
        tags: ["SlowFood", "Lunch"],
      },
      {
        id: "3",
        name: "Hamburger",
        price: 5,
        origins: ["USA"],
        tags: ["FastFood"],
      },
    ]);
    foodService.getAllByTag.mockResolvedValue([
      {
        id: "1",
        name: "Pizza Pepperoni",
        price: 10,
        origins: ["Italy"],
        tags: ["FastFood", "Pizza", "Lunch"],
      },
      {
        id: "3",
        name: "Hamburger",
        price: 5,
        origins: ["USA"],
        tags: ["FastFood"],
      },
    ]);
    jest.spyOn(require("react-router-dom"), "useParams").mockReturnValue({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders Search, Tags, and Thumbnails components", async () => {
    render(
      <Router>
        <HomePage />
      </Router>
    );
    //search bar is rendered
    expect(
      screen.getByPlaceholderText(/Search Food Mine!/i)
    ).toBeInTheDocument();

    //tags are rendered
    expect(screen.getByTestId("tags-component")).toBeInTheDocument();
    const tagsss = await screen.findAllByTestId("tag-link");
    expect(tagsss).toHaveLength(3);

    //thumbnails are rendered
    const thumbnails = screen.getAllByTestId("thumbnails");
    expect(thumbnails).toHaveLength(3);
  });

  test("loads and displays foods based on tag", async () => {
    const taggedFoods = [
      {
        id: "1",
        name: "Pizza Pepperoni",
        price: 10,
        origins: ["Italy"],
        tags: ["FastFood", "Pizza", "Lunch"],
      },
      {
        id: "3",
        name: "Hamburger",
        price: 5,
        origins: ["USA"],
        tags: ["FastFood"],
      },
    ];
    foodService.getAllByTag.mockResolvedValue(taggedFoods);
    require("react-router-dom").useParams.mockReturnValue({
      tag: "tag",
    });

    render(
      <Router>
        <HomePage />
      </Router>
    );

    const thumbnails = await screen.findAllByTestId("thumbnails");
    expect(thumbnails).toHaveLength(2);
    expect(await screen.findByText("Pizza Pepperoni")).toBeInTheDocument();
    expect(await screen.findByText("Hamburger")).toBeInTheDocument();
  });

  test("loads and displays foods based on search term", async () => {
    const searchedFoods = [
      {
        id: "1",
        name: "Pizza Pepperoni",
        price: 10,
        origins: ["Italy"],
        tags: ["FastFood", "Pizza", "Lunch"],
      },
    ];
    foodService.search.mockResolvedValue(searchedFoods);
    require("react-router-dom").useParams.mockReturnValue({
      searchTerm: "searchTerm",
    });

    render(
      <Router>
        <HomePage />
      </Router>
    );

    const thumbnails = await screen.findAllByTestId("thumbnails");
    expect(thumbnails).toHaveLength(1);
    expect(await screen.findByText("Pizza Pepperoni")).toBeInTheDocument();
  });

  test("displays NotFound component when no foods are found", async () => {
    foodService.getAll.mockResolvedValue([]);
    require("react-router-dom").useParams.mockReturnValue({});

    render(
      <Router>
        <HomePage />
      </Router>
    );

    expect(await screen.findByText("Nothing Found!")).toBeInTheDocument();
    expect(await screen.findByText("Reset search")).toBeInTheDocument();
  });
});
