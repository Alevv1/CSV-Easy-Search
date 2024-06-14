import { ApiSearchResponse, Data } from "../types"
import {API_HOST} from '../config'
export const searchData = async (search: string): Promise<[Error | null, Data | null]> => {

    try {
        const res = await fetch(`${API_HOST}/api/users?q=${search}`,)

        if (!res.ok) {
            throw new Error(`Error searching data: ${res.statusText}`)
        }

        const json = await res.json() as ApiSearchResponse
        return [null, json.data]
    } catch (error) {
        if (error instanceof Error) {
            return [error, null]
        } else {
            return [new Error('An unknown error occurred'), null]
        }
    }
}