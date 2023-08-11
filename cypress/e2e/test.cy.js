describe('My First Test', () => {
    it('Visits a chrome-extension', () => {
        cy.task('setBrowser')
            .get('.btn-primary')
            .click()
            .children()
            .then(e => console.info(e));
    });


    it('Does not do much!', () => {
        cy.visit('https://casperswap-integration-net-git-feat-staking-system-rengolabs.vercel.app/')
        cy.get('button').contains('Connect Wallet').click()
        cy.get('p').contains('Casper Wallet').parent().click()
        // TODO validate wallet connection
        cy.wait(1000)
        // cy.get('button').contains('Connect Wallet').should('not.exist')
        cy.get('p').contains('Connected').should('exist')
        // cy.wait(4000)
        // cy.get('p').contains('Connected').should('not.exist')
    })
})
