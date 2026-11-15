
import api from '../interceptor/api'

export interface UserProfile {
    id: string
    fullName: string
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
    profilePicture: string | null
    updatedAt: string
    createdAt: string
}

export interface UserProfileResponse {
    user: UserProfile
    additionalPercentage: number
}

export const getUserById = async (
    userId: string | number
): Promise<UserProfileResponse> => {
    const { data } = await api.get<UserProfileResponse>(
        `/api/users/${userId}`
    )

    return data
}
