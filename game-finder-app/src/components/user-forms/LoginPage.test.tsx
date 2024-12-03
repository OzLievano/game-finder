import React, { act } from "react";
import { render, screen, cleanup } from "@testing-library/react";
import { LoginPage } from "./LoginPage";
import { logIn } from "./users.api";
import { MemoryRouter } from "react-router-dom";

jest.mock("./users.api", () => ({
  logIn: jest.fn().mockResolvedValue({}),
}));

afterEach(() => {
  cleanup();
});

describe("LoginPage", () => {
  it("should render the component", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      );
    });

    const button = screen.getByTestId("login-button");
    expect(button).toBeInTheDocument();
  });

  it("calls the logIn function on login", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      );
    });

    const button = screen.getByTestId("login-button");

    // Use act for triggering the click event as well
    await act(async () => {
      button.click();
    });

    expect(logIn).toHaveBeenCalled();
  });
});
