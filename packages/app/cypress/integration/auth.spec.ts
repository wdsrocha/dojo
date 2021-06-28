import {
  VALID_USERNAME,
  VALID_PASSWORD,
  INVALID_USERNAME,
  INVALID_PASSWORD,
} from "../support/constants";

describe("Auth", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should allow a user to login and logout", () => {
    cy.getByTestId("login-open").click();
    cy.getByTestId("login-username").type(VALID_USERNAME);
    cy.getByTestId("login-password").type(VALID_PASSWORD);
    cy.getByTestId("login-submit").click();

    cy.getByTestId("login-open").should("not.exist");
    cy.getByTestId("user-menu").should("contain", "user1").trigger("mouseover");
    cy.getByTestId("user-menu-logout").click();

    cy.getByTestId("login-open").should("exist");
  });

  it("should reload session on page reload", () => {
    cy.getByTestId("login-open").click();
    cy.getByTestId("login-username").type(VALID_USERNAME);
    cy.getByTestId("login-password").type(VALID_PASSWORD);
    cy.getByTestId("login-submit").click();
    cy.reload();
    cy.getByTestId("user-menu").should("contain", "user1");
  });

  it("should error for an invalid username", () => {
    cy.getByTestId("login-open").click();
    cy.getByTestId("login-username").type(INVALID_USERNAME);
    cy.getByTestId("login-password").type(VALID_PASSWORD);
    cy.getByTestId("login-submit").click();
    cy.getByTestId("login-alert").should(
      "contain",
      "Nome de usuário ou senha inválidos",
    );
  });

  it("should error for an invalid password for existing user", () => {
    cy.getByTestId("login-open").click();
    cy.getByTestId("login-username").type(VALID_USERNAME);
    cy.getByTestId("login-password").type(INVALID_PASSWORD);
    cy.getByTestId("login-submit").click();
    cy.getByTestId("login-alert").should(
      "contain",
      "Nome de usuário ou senha inválidos",
    );
  });

  it("should error if login request fails", () => {
    cy.intercept(
      {
        method: "POST",
        url: "**/authentication/login",
      },
      { statusCode: 500 },
    );
    cy.getByTestId("login-open").click();
    cy.getByTestId("login-username").type(VALID_USERNAME);
    cy.getByTestId("login-password").type(VALID_PASSWORD);
    cy.getByTestId("login-submit").click();
    cy.getByTestId("login-alert").should(
      "contain",
      "Um erro inesperado ocorreu. Por favor, tente novamente",
    );
  });
});
