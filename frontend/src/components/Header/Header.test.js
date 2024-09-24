import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import Header from "./Header";
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../hooks/useAuth";
import * as userService from "../../services/userService";
import "@testing-library/jest-dom";

// Mock the hooks and userService
jest.mock("../../hooks/useCart");
jest.mock("../../hooks/useAuth");
jest.mock("../../services/userService", () => ({
  getUser: jest.fn(),
  logout: jest.fn(),
}));

describe("Header Component", () => {
  beforeEach(() => {
    // Mock the userService functions
    userService.getUser.mockReturnValue(null);
    userService.logout.mockReturnValue(jest.fn());

    useCart.mockReturnValue({
      cart: { totalCount: 0 },
    });

    useAuth.mockReturnValue({
      user: null,
      logout: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders logo and navigation links", () => {
    render(
      <Router>
        <Header />
      </Router>
    );

    expect(screen.getByText("Food Mine!")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Cart")).toBeInTheDocument();
  });

  test("renders user menu when user is logged in", () => {
    useAuth.mockReturnValue({
      user: { name: "John Doe" },
      logout: jest.fn(),
    });

    render(
      <Router>
        <Header />
      </Router>
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Orders")).toBeInTheDocument();
    expect(screen.getByText("Log out")).toBeInTheDocument();
  });

  test("calls logout function when logout link is clicked", () => {
    const mockLogout = jest.fn();
    useAuth.mockReturnValue({
      user: { name: "John Doe" },
      logout: mockLogout,
    });

    render(
      <Router>
        <Header />
      </Router>
    );

    fireEvent.click(screen.getByText("Log out"));
    expect(mockLogout).toHaveBeenCalled();
  });

  test("displays cart count when there are items in the cart", () => {
    useCart.mockReturnValue({
      cart: { totalCount: 5 },
    });

    render(
      <Router>
        <Header />
      </Router>
    );

    expect(screen.getByText("5")).toBeInTheDocument();
  });

  test("toggles overlay panel when notification icon is clicked", async () => {
    render(
      <Router>
        <Header />
      </Router>
    );

    const notificationIcon = screen.getByTestId("NotificationsNoneIcon");
    await fireEvent.click(notificationIcon);

    const overlayPanel = await screen.findByTestId("notifications-panel");
    expect(overlayPanel).toBeInTheDocument();
  });
});
