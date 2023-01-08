import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { Anchor } from '../../../../components/atoms/Anchor'
import { MemoryRouter } from 'react-router'



describe("Test Anchor Component", () => {
    test('Return an anchor', async () => {
        render(<Anchor isAnchor={true} to="/" insideMessage="something" />)
        const anchor = screen.getByText('something')
        expect(anchor).toBeInTheDocument()
    })

    it.skip("Return a link component", () => {
        render(
            <MemoryRouter>
                <Anchor isAnchor={false} to="/" insideMessage="something" />
            </MemoryRouter>
        )
        expect(screen.getByText('something')).tobeInTheDocument()
    })
})
