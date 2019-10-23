import * as notification from '../../../helpers/notification';

describe('my interests', () => {
  beforeEach(() => {
    cy.window().then(win => win.sessionStorage.clear());
    cy.requireLoggedIn();
    cy.visit('/');
    notification.enableNotificationPreferenceChannel();
  });

  notification.myInterestTests();
});