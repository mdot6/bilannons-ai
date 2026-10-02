export interface CreateAdvertisementRequest {
    make: string
    model: string
    modelYear: number
    mileage: number
    fuelType: string
    transmission: string
    registrationNumber?: string
    color?: string
    equipment?: string
    serviceHistory?: string
    condition?: string
    knownIssues?: string
    askingPrice?: number
}

export interface VehicleResponse {
    make: string
    model: string
    modelYear: number
    mileage: number
    fuelType: string
    transmission: string
    registrationNumber: string | null
    color: string | null
    equipment: string | null
    serviceHistory: string | null
    condition: string | null
    knownIssues: string | null
    askingPrice: number | null
}

export interface AdvertisementResponse {
    id: string
    status: string
    title: string | null
    fullDescription: string | null
    marketplaceDescription: string | null
    sellingPoints: string[]
    missingInformation: string[]
    salesChecklist: string[]
    createdAt: string
    updatedAt: string | null
    vehicle: VehicleResponse
}

/** Felstrukturen som ASP.NET Core returnerar vid valideringsfel. */
export interface ValidationProblem {
    title: string
    status: number
    errors: Record<string, string[]>
}