import api from '../interceptor/api'

export interface IHotelDetail {
    id: string
    title: string
    address: string
    photos: string[]
    rate: string
    price: string
    discounted_price: string | null | number
    tags: string[]
    last_updated: string
    capacity: number
    location: { lat: number; lng: number }
    categories: { name: string }
    bathrooms: number
    parking: number
    rooms: number
    yard_type: string
    num_comments: number
    discount_id: string | null
    transaction_type: string
    sellerId: string
    sellerName: string
    caption: string
    favoriteId: string | null
    bookings: number
    isFavorite: boolean
}

export interface Comment {
    id: string
    caption: string
    rating: string
    created_at: string
    parent_comment_id: string | null
    user: {
        firstName: string
        lastName: string
        profilePicture: string | null
    }
}

interface CommentsResponse {
    comments: Comment[]
    totalCount: number
}

export interface AddCommentPayload {
    house_id: number | string
    title: string
    caption: string
    rating: number
    parent_comment_id: string | null
}

export const addComment = async (payload: AddCommentPayload) => {
    const { data } = await api.post<Comment>('/api/comments', payload)
    return data
}

export const getCommentsByHouseId = async (houseId: number | string) => {
    const { data } = await api.get<CommentsResponse>('/api/comments', {
        params: { house_id: houseId },
    })
    return data
}

export async function getHouseById(id: string | number, params?: AbortSignal): Promise<IHotelDetail> {
    const { data } = await api.get<IHotelDetail>(`/api/houses/${id}`, { params })
    return data
}

