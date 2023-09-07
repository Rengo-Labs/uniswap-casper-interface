
describe('Swap Test', () => {

    it('Swap selecting another pair',  () => {
        cy.visit('http://localhost:3000/liquidity')
        cy.get('button').contains('Connect Wallet').click()
        cy.get('p').contains('Casper Wallet').parent().click()
        cy.get('p').contains('Connected').should('exist')

        cy.wait(16000)
        cy.get('#To').contains('ETH').click()

        cy.wait(1000)
        cy.get('p').contains('CST').click()

        cy.wait(1000)
        cy.get('#see-actions-icon-desktop-cf56e334481fe2bf0530e0c03a586d2672da8bfe1d1d259ea91457a3bd8971e0').parent().click().should('exist')
        cy.get('#cst-action-item-desktop-cf56e334481fe2bf0530e0c03a586d2672da8bfe1d1d259ea91457a3bd8971e0').click().should('exist')


        cy.wait(2000)
        //cy.get('@windowOpen').should('be.called');
        /*cy.get('[class*="ActionsWrapper"] > [class*="ActionsInnerWrapper"] > [class*="ActionItem"] > p').contains('Claim').parent().then(item => {
            console.log("item", item.get())
            item.get()[0].click()
        })*/
        /*cy.get('[class*="SeeActionsIconWrapper"] > svg').then(item => {
            console.log("Item", item)
            console.log("Item Selected", item.get()[0])
            item.get()[0].parent().click()
        })*/
        /*

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

         */
    })
/*
    it('should firm transaction', () => {

        cy.wait(3000)
        cy.visit('chrome-extension://abkahkcbhngaebpcgfmhkoioedceoigp/signature-request.html?requestId=2&signingPublicKeyHex=01bfc3a6ef64a60ac676b279eee8f89290da1246c73f17cdfac5dcf9587e1a8c70#/sign-deploy')

        cy.get('button').contains('Sign').click().should('exist')
    });
    */
})