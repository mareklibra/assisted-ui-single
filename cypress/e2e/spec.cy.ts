describe('template spec', () => {
  it('passes', () => {
    cy.visit('/');

    cy.get('h2').contains('Cluster details');
    cy.get('.pf-c-page__main').scrollTo('bottom');
    cy.get('button[name="next"]').contains('Next').should('be.disabled');
  });
});
