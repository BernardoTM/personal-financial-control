export interface CategorieResponse {
    id: number,
    name: string,
    description: string,
    color: string,
    updated_at: Date,
    created_at: Date
}

export interface CreateCategorie {
    name: string,
    description?: string,
    color: string


}

export interface UpdateCategorie {
    id?: number,
    name?: string,
    description?: string,
    color?: string,
}