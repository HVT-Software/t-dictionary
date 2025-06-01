import Image from 'next/image';

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="text-center sm:text-left">
          <h1 className="text-4xl font-bold mb-4">T-Dictionary Man Page</h1>
          <p className="text-lg text-muted-foreground">Sử dụng UI components và Tailwind config từ monorepo</p>
        </div>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <button className="rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 font-medium transition-colors">
            Primary Button
          </button>
          <button className="rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground px-6 py-3 font-medium transition-colors">
            Secondary Button
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-2">Card 1</h3>
            <p className="text-sm text-muted-foreground">Đây là một card sử dụng design system từ monorepo.</p>
          </div>
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-2">Card 2</h3>
            <p className="text-sm text-muted-foreground">Card này cũng sử dụng cùng design system.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
