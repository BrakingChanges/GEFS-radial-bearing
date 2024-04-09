

describe('Radial check', () => {
  it('Checks for radials', () => {
    cy.visit('http://localhost:5173/')
    cy.intercept({ resourceType: /xhr|fetch/, url: 'http://localhost:5000/*' }, { log: false })


    cy.get('#flight-stats-container > details')
      .invoke('attr', 'open', true)
      .should('have.attr', 'open')

    cy.get('#dist-input')
      .type('2000')
      .should('have.value', '2000')


    cy.get('#waypoint-input')
      .type('MUSRI')
      .should('have.value', 'MUSRI')

    cy.get('#wp-crs')
      .type('260')
      .should('have.value', '260')

    cy.get('#wp-slider')
      .should('have.value', '260')
      .click({force: true})
      .invoke('val', 300)
      .trigger('input')

    cy.get('#wp-crs')
      .should('have.value', '300')

    cy.get('#wp-form')
      .submit()



  })
})