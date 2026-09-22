export function Loading() {
  return <div className="panel state">Loading verified artifacts...</div>;
}

export function ErrorState({ message }: { message: string }) {
  return <div className="panel state error">Unable to load data: {message}</div>;
}
