import type {
    AdvertisementResponse,
    CreateAdvertisementRequest,
    ValidationProblem
} from '../types/advertisement'

const BASE_URL = import.meta.env.VITE_API_URL

/** Kastas vid valideringsfel från API:t, så att formuläret kan visa fel per fält. */
export class ApiValidationError extends Error {
    constructor(public readonly errors: Record<string, string[]>) {
        super('Valideringen misslyckades.')
        this.name = 'ApiValidationError'
    }
}

async function handleResponse<T>(response: Response): Promise<T> {
    if (response.status === 400) {
        const problem = (await response.json()) as ValidationProblem
        throw new ApiValidationError(problem.errors ?? {})
    }

    if (response.status === 404) {
        throw new Error('Annonsen kunde inte hittas.')
    }

    if (!response.ok) {
        throw new Error('Något gick fel. Försök igen om en stund.')
    }

    return (await response.json()) as T
}

export async function createAdvertisement(
    request: CreateAdvertisementRequest
): Promise<AdvertisementResponse> {
    const response = await fetch(`${BASE_URL}/api/advertisements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
    })

    return handleResponse<AdvertisementResponse>(response)
}

export async function generateAdvertisement(
    id: string
): Promise<AdvertisementResponse> {
    const response = await fetch(`${BASE_URL}/api/advertisements/${id}/generate`, {
        method: 'POST'
    })

    return handleResponse<AdvertisementResponse>(response)
}

export async function getAdvertisement(
    id: string
): Promise<AdvertisementResponse> {
    const response = await fetch(`${BASE_URL}/api/advertisements/${id}`)

    return handleResponse<AdvertisementResponse>(response)
}