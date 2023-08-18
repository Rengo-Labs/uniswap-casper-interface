
describe('Swap Test', () => {

    it('Swap selecting another pair', () => {
        cy.visit('http://localhost:3000/swap/')
        cy.get('button').contains('Connect Wallet').click()
        cy.get('p').contains('Casper Wallet').parent().click()
        cy.get('p').contains('Connected').should('exist')

        cy.wait(4000)
        cy.get('[class="styles__IconWrapper-sc-1kdn6jr-5 Rspa-d"]').contains('CSPR').click()

        cy.wait(2000)
        cy.get('p').contains('CasperSwap').click()

        cy.wait(1000)
        cy.get('[id=From]').find('input').type('1000')

        cy.wait(1000)
        cy.get('#From').contains('Balance:').should($value => {
            console.log("val", $value.get()[0].innerText)
        })

        cy.wait(1000)
        cy.get('#To').contains('Balance:').should($value => {
            console.log("val", $value.get()[0].innerText)
        })

        cy.wait(1000)
        cy.get('button').contains('SWAP').click()
    })
})