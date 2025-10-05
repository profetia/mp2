import axios from "axios";

const endpoint = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    timeout: 1000,
    headers: {
        'Authorization': `Bearer ${process.env.REACT_APP_API_KEY}`
    }
});

function cache(maxAge = 600000) {
    const cacheStore = new Map<string, { timestamp: number; value: any }>();

    return function (
        _target: any,
        _propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        const original = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            const key = JSON.stringify(args);
            const cached = cacheStore.get(key);

            if (cached && Date.now() - cached.timestamp < maxAge) {
                return { ...cached.value, fromCache: true };
            }

            const result = await original.apply(this, args);
            cacheStore.set(key, { timestamp: Date.now(), value: result });
            return { ...result, fromCache: false };
        };

        return descriptor;
    };
}

class ApiUtils {
    @cache()
    async fetchMovieList() {
        return await endpoint.get("/genre/movie/list", {
            params: {
                language: 'en'
            }
        })
    }

    @cache()
    async fetchMovie({ page = 1, genre }: { page: number, genre?: number }) {
        return await endpoint.get(
            `/discover/movie`,
            {
                params: {
                    include_adult: false,
                    include_video: false,
                    language: 'en-US',
                    sort_by: 'popularity.desc',
                    page,
                    with_genres: genre,
                }
            }
        )
    }

    @cache()
    async fetchDetails({ movie_id }: { movie_id: number }) {
        return await endpoint.get(`/movie/${movie_id}`, {
            params: {
                language: "en-US",
            }
        })
    }
}

const api = new ApiUtils();
export const fetchMovieList = api.fetchMovieList;
export const fetchMovie = api.fetchMovie;
export const fetchDetails = api.fetchDetails;

export const POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500/";