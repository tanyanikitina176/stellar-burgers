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
    cy.viewport(1300, 800);
    cy.visit('http://localhost:4000');
  });

  afterEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  const testIngredientAddition = (ingredientsName: string) => {
    cy.contains('[data-cy="ingredient-item"]', ingredientsName)
      .find('button')
      .contains('Добавить')
      .click();
    cy.get('[data-cy="constructor-item"]')
      .contains(ingredientsName)
      .should('exist');
  };

  it('добавление ингредиентов и оформление заказа корректно', () => {
    cy.get('[data-cy="ingredient-item"]').should('have.length', 3);
    testIngredientAddition('Биокотлета');
    testIngredientAddition('Соус');
    testIngredientAddition('Краторная булка');
    cy.contains('[data-cy="button-order"]', 'Оформить заказ').click();
    cy.getCookie('accessToken').should('exist');
    cy.get('[data-cy="modal"]').should('be.visible');
    cy.wait('@createOrder').then((interception) => {
      const response = interception.response!;
      const expectedNumber = response.body.order.number;

      cy.get('[data-cy="order-number"]').should(
        'have.text',
        expectedNumber.toString()
      );
    });
    cy.get('[data-cy="modal"]').find('button').click();
    cy.get('[data-cy="modal"]').should('not.exist');
    cy.get('[data-cy="constructor"]')
      .children()
      .should('not.contain', '[data-cy="constructor-item"]');
  });
});
