import React from 'react';

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { error: Error | null }> {
  constructor(props: any) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <pre style={{ color: 'red', whiteSpace: 'pre-wrap' }}>
          Error during component render: {this.state.error.message}
        </pre>
      );
    }
    return this.props.children;
  }
}
