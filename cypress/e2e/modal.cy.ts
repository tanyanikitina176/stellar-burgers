describe('корректная работа модальных окон', () => {
  beforeEach(function () {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.viewport(1300, 800);
    cy.visit('http://localhost:4000');
    cy.wait('@getIngredients');
  });

  it('открытие модального окна ингредиента и закрытие по клику на крестик', () => {
    cy.contains('[data-cy="ingredient-item"]', 'Краторная булка').click();
    cy.get('[data-cy="modal"]')
      .should('be.visible')
      .contains('Краторная булка');
    cy.get('[data-cy="modal"]').find('button').click();
    cy.get('[data-cy="modal"]').should('not.exist');
  });

  it('открытие модального окна и закрытие по клику на оверлей', () => {
    cy.contains('[data-cy="ingredient-item"]', 'Биокотлета').click();
    cy.get('[data-cy="modal"]').should('be.visible').contains('Биокотлета');
    cy.get('[data-cy="overlay"]').click({ force: true });
    cy.get('[data-cy="modal"]').should('not.exist');
  });
});
