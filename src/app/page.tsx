import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { PartyPopper } from 'lucide-react';

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-party');

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-purple-50/50 dark:to-purple-950/20 p-8">
      <div className="w-full max-w-5xl mx-auto text-center">
        <div className="mb-8 flex justify-center items-center gap-3">
          <PartyPopper className="w-12 h-12 text-primary" />
          <h1 className="text-5xl md:text-7xl font-bold font-headline tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-accent">
            BashConnect
          </h1>
        </div>

        <p className="max-w-2xl mx-auto mt-4 text-lg md:text-xl text-muted-foreground font-body">
          The ultimate party planning tool. Create an event, share the link, and chat with your guests in real-time. No sign-ups required.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
          <Button asChild size="lg" className="font-bold text-lg px-8 py-6 transition-transform transform hover:scale-105">
            <Link href="/create">Create Your Party</Link>
          </Button>
          <Button asChild size="lg" variant="ghost" className="text-lg">
            <Link href="#features">Learn More</Link>
          </Button>
        </div>
      </div>
      
      <div id="features" className="w-full max-w-6xl mx-auto mt-24 text-left">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-12">Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg border shadow-sm">
                <h3 className="text-xl font-bold font-headline mb-2 text-primary">Easy Party Creation</h3>
                <p className="text-muted-foreground">Set up your event in seconds with a simple form for party details.</p>
            </div>
            <div className="bg-card p-6 rounded-lg border shadow-sm">
                <h3 className="text-xl font-bold font-headline mb-2 text-primary">Guest Invitation Link</h3>
                <p className="text-muted-foreground">Generate a unique link for guests to join your party instantly—no accounts needed.</p>
            </div>
            <div className="bg-card p-6 rounded-lg border shadow-sm">
                <h3 className="text-xl font-bold font-headline mb-2 text-primary">Real-time Party Chat</h3>
                <p className="text-muted-foreground">Engage with all your guests in a dedicated, real-time chat room for your event.</p>
            </div>
            <div className="bg-card p-6 rounded-lg border shadow-sm">
                <h3 className="text-xl font-bold font-headline mb-2 text-primary">AI Activity Suggestions</h3>
                <p className="text-muted-foreground">Get creative party activity ideas from our AI to make your event unforgettable.</p>
            </div>
             <div className="bg-card p-6 rounded-lg border shadow-sm md:col-span-2">
                 {heroImage && (
                     <Image
                         src={heroImage.imageUrl}
                         alt={heroImage.description}
                         width={1200}
                         height={800}
                         className="rounded-lg object-cover w-full h-full"
                         data-ai-hint={heroImage.imageHint}
                     />
                 )}
            </div>
          </div>
      </div>
    </main>
  );
}
