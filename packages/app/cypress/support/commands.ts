/**
 * Get one or more DOM elements based on the `data-cy` attribute.
 * @example
 *    cy.getByTestId('login') // Equivalent to `cy.get('[data-test=login]')`
 */
const getByTestId = <E extends Node = HTMLElement>(
  selector: string,
  options?: Partial<
    Cypress.Loggable & Cypress.Timeoutable & Cypress.Withinable & Cypress.Shadow
  >,
): Cypress.Chainable<JQuery<E>> => cy.get(`[data-test=${selector}]`, options);

declare namespace Cypress {
  interface Chainable {
    getByTestId: typeof getByTestId;
  }
}

Cypress.Commands.add("getByTestId", getByTestId);
