describe('My First Test', () => {
    beforeEach(() => {})

    it('Set the wallet extension at the first time', () => {
       cy.task('setOnboarding')
    });

    it('Set the wallet extension password', () => {
        // cy.task('setPassword')
    });

    it('Set the wallet extension connected ', () => {
        cy.visit('/')
        cy.wait(1000)
        cy.get('button').contains('Connect Wallet').click()
        cy.get('p').contains('Casper Wallet').parent().click()
        // TODO validate wallet connection
        cy.wait(3000)
        cy.task('signContract')
        //cy.get('p').should('have.text', 'Connected')
    });

    // it('Check wallet connected', () => {
    //     cy.visit('/')
    //     cy.wait(1000)
    //     cy.get('button').contains('Connect Wallet').click()
    //     cy.get('p').contains('Casper Wallet').parent().click()
    //     // TODO validate wallet connection
    //     cy.wait(1000)
    //     cy.get('p').should('have.text', 'Connected')
    // })
})
