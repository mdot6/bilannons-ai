\# BilAnnons AI



Webbtjänst som hjälper svenska privatpersoner att skapa en professionell

bilannons. Användaren fyller i uppgifter om bilen och får tillbaka en

färdig annonstext, en kortversion för Facebook Marketplace,

försäljningsargument, en checklista inför försäljning och en lista på

uppgifter som saknas.



\## Grundprincip



Tjänsten beskriver bara det användaren själv har fyllt i. Fält som lämnas

tomma utelämnas ur annonsen i stället för att gissas, och ett tomt fält

för kända fel tolkas aldrig som att bilen är felfri – det hamnar i

stället bland de uppgifter som saknas.



\## Teknik



\*\*Frontend:\*\* React 19, TypeScript, Vite, React Router, Tailwind CSS

\*\*Backend:\*\* ASP.NET Core Web API (.NET 10), Entity Framework Core

\*\*Databas:\*\* SQLite lokalt, PostgreSQL planerat för drift

\*\*API-dokumentation:\*\* OpenAPI med Scalar

\*\*Tester:\*\* xUnit



\## Komma igång



Kräver .NET 10 SDK och Node.js 24 eller senare.



\### Backend



```bash

cd backend

dotnet ef database update --project src/BilAnnonsAI.Api

dotnet run --project src/BilAnnonsAI.Api --launch-profile https

```



API:t startar på `https://localhost:7212` och öppnar

API-dokumentationen på `/scalar/v1`.



\### Frontend



```bash

cd frontend/bilannons-web

npm install

npm run dev

```



Appen startar på `http://localhost:5173`. Backend måste köra parallellt.



\### Tester



```bash

cd backend

dotnet test

```



\## API



| Metod | Endpoint | Beskrivning |

|---|---|---|

| GET | `/api/health` | Kontrollerar att API:t svarar |

| POST | `/api/advertisements` | Sparar biluppgifter, skapar utkast |

| POST | `/api/advertisements/{id}/generate` | Genererar annonsinnehållet |

| GET | `/api/advertisements/{id}` | Hämtar annons med biluppgifter |



Valideringsfel returneras som `application/problem+json` med

felmeddelanden per fält.



\## Arkitektur



Frontend kommunicerar enbart med ASP.NET Core-API:t, aldrig direkt med

databasen eller någon AI-leverantör.



Annonsgenereringen ligger bakom gränssnittet `IAdGenerator`. Den

nuvarande implementationen är regelbaserad och kan inte hitta på

uppgifter. Den ska ersättas av en Python-tjänst mot en språkmodell,

vilket då sker genom att byta registrering i `Program.cs`.



API:t exponerar DTO:er, inte databasmodeller. Det hindrar klienten från

att sätta fält den inte äger, som betalstatus.



\## Planerad vidareutveckling



\- Python- och FastAPI-tjänst mot en språkmodell, med strukturerade svar

\- Bilduppladdning

\- PDF-export

\- Betalning via Stripe

\- Uppslag av fordonsuppgifter via registreringsnummer, när en laglig

&#x20; datakälla har valts



\## Känd begränsning



`Microsoft.OpenApi` 2.0.0 har en rapporterad sårbarhet (NU1903) och dras

in transitivt av `Microsoft.AspNetCore.OpenApi`. Versionen går inte att

höja utan att källgenereringen går sönder. API-dokumentationen exponeras

endast i utvecklingsmiljö. Referensen uppdateras när ASP.NET Core

uppdaterat sitt beroende.

