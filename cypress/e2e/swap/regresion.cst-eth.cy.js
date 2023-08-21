
describe('Swap Test', () => {

    it('Swap selecting another pair', () => {
        cy.visit('http://localhost:3000/swap/')
        cy.get('button').contains('Connect Wallet').click()
        cy.get('p').contains('Casper Wallet').parent().click()
        cy.get('p').contains('Connected').should('exist')

        cy.wait(4000)
        cy.get('#From').contains('CSPR').click()

        cy.wait(1000)
        cy.get('p').contains('CasperSwap').click()

        cy.wait(1000)
        cy.get('[id=From]').find('input').type('1000')

        cy.wait(2000)
        cy.get('#From').contains('Balance:').then(fromValue => {

            const previousFromBalance = new String(fromValue.get()[0].innerText).split(' ')[1]
            console.log("previousFromBalance", previousFromBalance)

            cy.wait(1000)
            cy.get('#To').contains('Balance:').then(toValue => {
                const previousToBalance = new String(toValue.get()[0].innerText).split(' ')[1]
                console.log("previousToBalance", previousToBalance)

                cy.wait(2000)
                cy.get('div').contains('Minimum received').parent().get('div').contains('ETH').then(receiveValue => {
                    const tokenToReceive = new String(receiveValue.get()[0].innerText).split(' ')[0]

                    console.log("tokenToReceive", tokenToReceive, "Latest balance", parseFloat(previousToBalance) + parseFloat(tokenToReceive))
                })
            })
        })

        cy.wait(1000)
        cy.get('button').contains('SWAP').click()
    })
})