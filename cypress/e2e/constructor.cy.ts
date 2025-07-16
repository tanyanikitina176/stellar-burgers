import { SELECTORS } from '../support/constants';

describe('добавление ингредиентов в конструктор и оформление заказа работает корректно', () => {
  beforeEach(function () {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' });
    cy.window().then((win) => {
      win.localStorage.setItem('refreshToken', 'test-refresh-token');
    });
    cy.setCookie('accessToken', 'test-access-token');
    cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as(
      'createOrder'
    );
    cy.visit('/');
  });

  afterEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('добавление ингредиентов и оформление заказа корректно', () => {
    cy.get(SELECTORS.INGREDIENT_ITEM).should('have.length', 3);
    cy.testIngredientAddition('Биокотлета');
    cy.testIngredientAddition('Соус');
    cy.testIngredientAddition('Краторная булка');
    cy.contains(SELECTORS.BUTTON_ORDER, 'Оформить заказ').click();
    cy.getCookie('accessToken').should('exist');
    cy.get(SELECTORS.MODAL).should('be.visible');
    cy.wait('@createOrder').then((interception) => {
      const response = interception.response!;
      const expectedNumber = response.body.order.number;

      cy.get(SELECTORS.ORDER_NUMBER).should(
        'have.text',
        expectedNumber.toString()
      );
    });
    cy.get(SELECTORS.MODAL).find('button').click();
    cy.get(SELECTORS.MODAL).should('not.exist');
    cy.get(SELECTORS.CONSTRUCTOR)
      .children()
      .should('not.contain', SELECTORS.CONSTRUCTOR_ITEM);
  });
});
