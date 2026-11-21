type ApiResponse<T> = {
    status: number,
    message: string,
    data: T
}

export async function api<T>(path: string, init: RequestInit): Promise<ApiResponse<T>> {
    const res = await fetch(`/api${path}`, {
        headers: { "Content-Type": "application/json"},
        ...init
    })

    const body: ApiResponse<T> = await res.json()
    return body
}