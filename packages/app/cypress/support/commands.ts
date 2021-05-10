// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

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
