import { Data } from "../types"
import { ApiUploadResponse } from "../types"
import { API_HOST } from '../config'

export const upload = async (file: File): Promise<[Error | null, Data | null]> => {
    const formData = new FormData()
    formData.append('file', file)

    try {
        const res = await fetch(`${API_HOST}/api/files`, {
            method: 'POST',
            body: formData
        })

        if (!res.ok) {
            throw new Error('Failed to upload file')
        }

        const json = await res.json() as ApiUploadResponse
        return [null, json.data]
    } catch (error) {
        if (error instanceof Error) {
            return [error, null]
        } else {
            return [new Error('An unknown error occurred'), null]
        }
    }
}