import {
  VALID_USERNAME,
  VALID_PASSWORD,
  VALID_SOLUTION_TO_URI_1000,
} from "../support/constants";

describe("Main paths", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should submit a correct solution and check its verdict", () => {
    cy.getByTestId("login-open").click();
    cy.getByTestId("login-username").type(VALID_USERNAME);
    cy.getByTestId("login-password").type(VALID_PASSWORD);
    cy.getByTestId("login-submit").click();

    cy.getByTestId("nav-problem").click();
    cy.contains("Hello World!").click();
    cy.location("pathname").should("include", "problem/uri-1000");
    cy.getByTestId("problem-footer-submit").scrollIntoView().click();
    cy.visit("/submit/uri-1000");

    cy.get("#submit_language").click({ force: true });
    cy.contains("C++").click();
    cy.get("#submit_code").type(VALID_SOLUTION_TO_URI_1000);
    cy.get("#submit_send").click();

    cy.location("pathname", { timeout: 10000 }).should("include", "submission");
    cy.contains("URI-1000");
    cy.contains(/(Pending|Accepted)/);
    cy.contains("C++");
    cy.contains("user1");
  });
});
