import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  return <div className="container w-full max-w-screen-xl mx-auto h-full">Landing Page</div>;
}
