
describe('Swap Test', () => {

    it('Swap CSPR-ETH without selecting any other pair', () => {
        cy.visit('http://localhost:3000/swap/')
        cy.get('button').contains('Connect Wallet').click()
        cy.get('p').contains('Casper Wallet').parent().click()
        cy.get('p').contains('Connected').should('exist')
        cy.wait(4000)
        // TODO validate wallet connection
        cy.get('[id=From]').find('input').type('1000')
        cy.wait(1000)
        cy.get('button').contains('SWAP').click()
    })
})