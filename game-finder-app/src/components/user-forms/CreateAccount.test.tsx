import { render, screen, cleanup } from "@testing-library/react";
import { CreateAccountPage } from "./CreateAccountPage";
import { createAccount } from "./users.api";
import { MemoryRouter } from "react-router-dom";
import React, { act } from "react"; // Correct import for act

jest.mock("./users.api", () => ({
  createAccount: jest.fn().mockResolvedValue({}),
}));

afterEach(() => {
  cleanup();
});

describe("CreateAccountPage", () => {
  it("should render the component", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <CreateAccountPage />
        </MemoryRouter>
      );
    });

    const button = screen.getByTestId("create-account-button");
    expect(button).toBeInTheDocument();
  });

  it("calls the createAccount function on account creation", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <CreateAccountPage />
        </MemoryRouter>
      );
    });

    const button = screen.getByTestId("create-account-button");
    button.click();
    expect(createAccount).toHaveBeenCalled();
  });
});
