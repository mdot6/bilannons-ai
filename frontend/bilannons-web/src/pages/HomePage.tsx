import { Link } from 'react-router'

export function HomePage() {
    return (
        <div className="mx-auto max-w-2xl px-4 py-16">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900">
                Skriv en bättre bilannons
            </h1>

            <p className="mt-4 text-lg text-slate-600">
                Fyll i uppgifterna om din bil så får du en färdig annons att
                kopiera till Blocket eller Facebook Marketplace. Du får också
                en checklista inför fotografering och en lista på sådant som
                köpare brukar fråga efter.
            </p>

            <Link
                to="/ny"
                className="mt-8 inline-block rounded-lg bg-slate-900 px-6 py-3
                   font-medium text-white hover:bg-slate-700"
            >
                Skapa annons
            </Link>

            <p className="mt-10 text-sm text-slate-500">
                Tjänsten beskriver bara det du själv fyller i. Granska alltid
                annonsen innan du publicerar den.
            </p>
        </div>
    )
}