describe('My First Test', () => {
    it('Does not do much!', () => {
        cy.visit('https://casperswap-integration-net-git-feat-staking-system-rengolabs.vercel.app/')
        cy.wait(5000)
        expect(true).to.equal(true)
    })
})
