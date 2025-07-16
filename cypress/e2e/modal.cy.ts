import { SELECTORS } from '../support/constants';

describe('корректная работа модальных окон', () => {
  beforeEach(function () {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('открытие модального окна ингредиента и закрытие по клику на крестик', () => {
    cy.contains(SELECTORS.INGREDIENT_ITEM, 'Краторная булка').click();
    cy.get(SELECTORS.MODAL).should('be.visible').contains('Краторная булка');
    cy.get(SELECTORS.MODAL).find('button').click();
    cy.get(SELECTORS.MODAL).should('not.exist');
  });

  it('открытие модального окна и закрытие по клику на оверлей', () => {
    cy.contains(SELECTORS.INGREDIENT_ITEM, 'Биокотлета').click();
    cy.get(SELECTORS.MODAL).should('be.visible').contains('Биокотлета');
    cy.get(SELECTORS.OVERLAY).click({ force: true });
    cy.get(SELECTORS.MODAL).should('not.exist');
  });
});
