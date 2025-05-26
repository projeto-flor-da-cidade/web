// src/components/ErrorBoundary.jsx
import React from 'react'

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  render() {
    return this.state.hasError
      ? <div className="p-4 text-red-600">Ocorreu um erro na aplicação.</div>
      : this.props.children
  }
}
