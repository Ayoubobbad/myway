import React from 'react'
import { render, screen } from '@testing-library/react'
import HomePage from '../app/page'

test('affiche un titre', () => {
  render(<HomePage />)
  expect(screen.getByRole('heading')).toBeInTheDocument()
})