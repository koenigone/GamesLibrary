import useData from "./useData";
import { Genre } from "./useGenres";

export interface Platforms {
  id: number
  name: string
  slug: string
}

export interface Games {
    id: number
    name: string
    metacritic: number
    released: string
    background_image: string
    parent_platforms: { platform: Platforms }[]
  }

const useGames = (selectedGenre: Genre | null, selectedPlatform: Platforms | null)=> useData<Games>('/games',
 { params: { genres: selectedGenre?.id, platforms: selectedPlatform?.id }},
 [selectedGenre?.id, selectedPlatform?.id])

export default useGames;