import PartyPage from './PartyPage';

export default function PartyDetailsPage({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen bg-background">
      <PartyPage partyId={params.id} />
    </main>
  );
}
