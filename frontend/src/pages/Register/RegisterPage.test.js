import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import RegisterPage from "./RegisterPage.js";
import { useAuth } from "../../hooks/useAuth";
import { useForm } from "react-hook-form";
import "@testing-library/jest-dom";

// Mock dependencies
jest.mock("react-hook-form", () => ({
  useForm: jest.fn(),
}));
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
  useSearchParams: jest
    .fn()
    .mockReturnValue([new URLSearchParams(), jest.fn()]), // Return a mock array
  useLocation: jest.fn().mockReturnValue({ pathname: "/register" }),
}));

jest.mock("../../hooks/useAuth", () => ({
  useAuth: jest.fn(),
}));

describe("RegisterPage", () => {
  const mockRegister = jest.fn();
  const mockGetValues = jest.fn();
  const mockCaptchaRef = { current: { getValue: jest.fn(), reset: jest.fn() } };

  beforeEach(() => {
    useForm.mockReturnValue({
      handleSubmit: jest.fn((fn) => (e) => {
        e.preventDefault();
        fn();
      }),
      register: jest.fn(),
      getValues: mockGetValues,
      formState: { errors: {} },
    });

    useAuth.mockReturnValue({
      user: null,
      register: mockRegister,
    });

    jest.spyOn(React, "useRef").mockReturnValue(mockCaptchaRef);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders RegisterPage", async () => {
    const history = createMemoryHistory();
    render(
      <Router location={history.location} navigator={history}>
        <RegisterPage />
      </Router>
    );

    expect(
      screen.getByRole("heading", { name: /register/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /name/i })).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Address")).toBeInTheDocument();
    expect(screen.getByTestId("recaptcha")).toBeInTheDocument();
    expect(screen.getByText("Already a user?")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /login here/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /register/i })
    ).toBeInTheDocument();
  });

  test("submits the form", async () => {
    const history = createMemoryHistory();
    render(
      <Router location={history.location} navigator={history}>
        <RegisterPage />
      </Router>
    );

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Test User" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText("Confirm Password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText("Address"), {
      target: { value: "123 Test St" },
    });
    fireEvent.click(screen.getByTestId("recaptcha"));

    const form = screen.getByRole("form");
    fireEvent.submit(form);
    expect(mockRegister).toHaveBeenCalled();
  });
});
