import { Link } from 'react-router'

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col">
            <header className="border-b border-rule bg-white">
                <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
                    <Link to="/" className="text-lg font-bold tracking-tight text-ink">
                        BilAnnons
                    </Link>
                    <Link
                        to="/ny"
                        className="text-sm font-medium text-plate hover:text-ink"
                    >
                        Skapa annons
                    </Link>
                </div>
            </header>

            <main className="flex-1">{children}</main>

            <footer className="border-t border-rule">
                <div className="mx-auto max-w-5xl px-5 py-6 text-sm text-muted">
                    Tjänsten skriver bara om det du själv fyller i. Granska annonsen
                    innan du publicerar den.
                </div>
            </footer>
        </div>
    )
}