import { baseEndpoint } from '../helpers/constants/backend';
import { delivery } from '../sample-data/checkout-flow';

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Make sure you have shipping method selected. Returns shipping method object.
       *
       * @memberof Cypress.Chainable
       *
       * @example
        ```
        cy.requireShippingMethodSelected(auth);
        ```
       */
      requireShippingMethodSelected: (auth: {}) => Cypress.Chainable<{}>;
    }
  }
}
Cypress.Commands.add('requireShippingMethodSelected', (auth) => {
  function setShippingMethod() {
    return cy.request({
      method: 'PUT',
      url: `${baseEndpoint}/users/current/carts/current/deliverymode?deliveryModeId=${delivery.mode}`,
      form: false,
      headers: {
        Authorization: `bearer ${auth.userToken.token.access_token}`,
      },
    });
  }

  cy.server();
  setShippingMethod().then((resp) => cy.wrap(resp));
});
