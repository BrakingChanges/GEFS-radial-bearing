

describe('Form check', () => {
  it('Ensures form application is functionally operational', () => {
    cy.intercept({ resourceType: /xhr|fetch/, url: 'http://localhost:5000/*' }, { log: false })
    cy.visit('http://localhost:5173/')

    cy.window()
      .then((doc) => new Cypress.Promise(resolve => { // Cypress will wait for this Promise to resolve
        const loadCompleted = () => {
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

          cy.get('#dep-runway-lat')
            .type('45.6')
            .should('have.value', '45.6')
            .clear()
            .type('45')
            .should('have.value', '45')

          cy.get('#dep-runway-lon')
            .type('45.6')
            .should('have.value', '45.6')
            .clear()
            .type('45')
            .should('have.value', '45')

          cy.get('#arr-runway-lat')
            .type('40.6')
            .should('have.value', '40.6')
            .clear()
            .type('40')
            .should('have.value', '40')

          cy.get('#arr-runway-lon')
            .type('40.6')
            .should('have.value', '40.6')
            .clear()
            .type('40')
            .should('have.value', '40')

          cy.get('#wp-dep-arr-form')
            .submit()



          doc.removeEventListener('loadCompleted', loadCompleted)
          resolve()
        }
        doc.addEventListener('loadCompleted', loadCompleted)
      }))







  })
})