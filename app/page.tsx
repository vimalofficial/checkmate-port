import { Navbar } from '@/components/navbar';
import { Hero } from '@/components/hero';
import { Services } from '@/components/services';
import { Portfolio } from '@/components/portfolio';
import { Contact } from '@/components/contact';
import { FloatingCallButton } from '@/components/FloatingCallButton';

export default function Home() {
  return (
    <main className="bg-background text-foreground">
      <Navbar />
      <Hero />
      <Services />
      <Portfolio />
      <Contact />

       <FloatingCallButton />

       
      <footer className="border-t border-border py-8 px-4">
        <div className="max-w-6xl mx-auto text-center text-muted-foreground">
          <p>&copy; 2026 Vimal - Full-Stack Developer. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
