import {
  VALID_USERNAME,
  VALID_PASSWORD,
  VALID_SOLUTION_TO_URI_1000,
} from "../support/constants";

describe("Submit", () => {
  beforeEach(() => {
    cy.visit("/submit/uri-1000");
  });

  it("should submit a solution", () => {
    cy.getByTestId("login-open").click();
    cy.getByTestId("login-username").type(VALID_USERNAME);
    cy.getByTestId("login-password").type(VALID_PASSWORD);
    cy.getByTestId("login-submit").click();

    cy.get("#submit_language").click({ force: true });
    cy.contains("C++").click();
    cy.get("#submit_code").type(VALID_SOLUTION_TO_URI_1000);
    cy.get("#submit_send").click();
    cy.location("pathname", { timeout: 10000 }).should("include", "submission");
  });

  it("should ask for login if user tries to submit a solution being logged off", () => {
    cy.visit("/submit/uri-1000");
    cy.get("#submit_language").click({ force: true });
    cy.contains("C++").click();
    cy.get("#submit_code").type(VALID_SOLUTION_TO_URI_1000);
    cy.get("#submit_send").click();
    cy.get(".ant-modal-body").should("exist");

    cy.get(".ant-modal-confirm-btns > .ant-btn").click();
    cy.location("pathname").should("include", "submit/uri-100");
  });
});
