import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import PaymentPage from "./PaymentPage";
import * as orderService from "../../services/orderService";

// Mock the dependencies
jest.mock("../../services/orderService", () => ({
  getNewOrderForCurrentUser: jest.fn(),
}));
jest.mock("../../components/Title/Title", () => () => (
  <div>Title Component</div>
));
jest.mock("../../components/OrderItemsList/OrderItemsList", () => () => (
  <div>OrderItemsList Component</div>
));
jest.mock("../../components/Map/Map", () => () => <div>Map Component</div>);
jest.mock("../../components/PaypalButtons/PaypalButtons", () => () => (
  <div>PaypalButtons Component</div>
));

describe("PaymentPage", () => {
  it("renders without crashing", async () => {
    orderService.getNewOrderForCurrentUser.mockResolvedValue({
      name: "John Doe",
      address: "123 Main St",
      addressLatLng: { lat: 40.7128, lng: -74.006 },
    });

    render(<PaymentPage />);

    await waitFor(() => {
      expect(screen.getByText("OrderItemsList Component")).toBeInTheDocument();
      expect(screen.getByText("Map Component")).toBeInTheDocument();
      expect(screen.getByText("PaypalButtons Component")).toBeInTheDocument();
    });
  });

  it("displays order details correctly", async () => {
    const mockOrder = {
      name: "John Doe",
      address: "123 Main St",
      addressLatLng: { lat: 40.7128, lng: -74.006 },
    };
    orderService.getNewOrderForCurrentUser.mockResolvedValue(mockOrder);

    render(<PaymentPage />);

    await waitFor(() => {
      expect(screen.getByText("Name:")).toBeInTheDocument();
      expect(screen.getByText(mockOrder.name)).toBeInTheDocument();
      expect(screen.getByText("Address:")).toBeInTheDocument();
      expect(screen.getByText(mockOrder.address)).toBeInTheDocument();
    });
  });

  it("handles error when fetching order fails", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    orderService.getNewOrderForCurrentUser.mockRejectedValue(
      new Error("Error fetching order")
    );

    render(<PaymentPage />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error fetching order:",
        expect.any(Error)
      );
    });

    consoleSpy.mockRestore();
  });

  it("does not render content if order is not found", async () => {
    orderService.getNewOrderForCurrentUser.mockResolvedValue(null);

    render(<PaymentPage />);

    await waitFor(() => {
      expect(screen.queryByText("Title Component")).not.toBeInTheDocument();
      expect(
        screen.queryByText("OrderItemsList Component")
      ).not.toBeInTheDocument();
      expect(screen.queryByText("Map Component")).not.toBeInTheDocument();
      expect(
        screen.queryByText("PaypalButtons Component")
      ).not.toBeInTheDocument();
    });
  });
});
