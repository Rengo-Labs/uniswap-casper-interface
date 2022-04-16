import { render, screen } from '@testing-library/react'
import {Title} from '../components/atoms'

describe('Title ATOM', () => {
  it('renders a title', () => {
    render(<Title title="this is a title"/>)

    const title = screen.getByText(/this is a title/)

    expect(title).toBeVisible()
  })
})