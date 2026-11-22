import api from '../interceptor/api'

export type FavoriteHouse = {
    id: string
    title: string
    address: string
    photos: string[] | null
    rate: string
    price: string
}

export type Favorite = {
    id: string
    user_id: string
    house_id: string
    created_at: string
    updated_at: string
    house: FavoriteHouse
}

export type FavoritesResponse = { data: Favorite[]; totalCount: number }

export const getFavorites = async (userId: string, page = 1, limit = 100) => {
    const { data } = await api.get<FavoritesResponse>(`/api/favorites/user/${userId}`, {
        params: { page, limit, sort: 'createdAt', order: 'DESC' },
    })
    return data
}

export const removeFavorite = async (favoriteId: string) => {
    const { data } = await api.delete<{ message: string }>(`/api/favorites/${favoriteId}`)
    return data
}
