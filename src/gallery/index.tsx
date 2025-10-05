import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";

import { Card, Flex, Image, Typography } from "antd";

import Error, { ERROR_FAIL_TO_FETCH } from '../common/Error';
import Loading from '../common/Loading';

import { fetchMovie, fetchMovieList, POSTER_BASE_URL } from '../common/ApiUtils';
import { debounce } from '../common/IoUtils';

import style from './index.module.scss';

const { Text } = Typography;

async function batchedFetchMovie(page: number, genre?: number, batchSize: number = 2) {
    let results: any[] = [];
    let currentPage = page * batchSize - (batchSize - 1);
    for (let i = 0; i < batchSize; i++) {
        let response = await fetchMovie({
            page: currentPage,
            genre: genre === -1 ? undefined : genre,
        });
        // console.log(response);
        let data = response.data;
        results.push(...data.results);
        currentPage++;
    }
    return results;
}

export default function Gallery() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [currentCategoryId, setCurrentCategoryId] = useState(-1);
    const [currentPage, setCurrentPage] = useState(1);

    const [category, setCategory] = useState<any[]>([]);
    const [movie, setMovie] = useState<any[]>([]);

    useEffect(() => {
        (async () => {
            try {
                let response = await fetchMovieList();
                let data = response.data;
                setCategory(data.genres);
                setCurrentCategoryId(-1);
            } catch (err) {
                setLoading(false);
                setError(ERROR_FAIL_TO_FETCH);
            }
        })();
    }, [])

    useEffect(() => {
        (async () => {
            setCurrentPage(1);

            try {
                let results = await batchedFetchMovie(
                    1,
                    currentCategoryId === -1 ? undefined : currentCategoryId,
                );
                setLoading(false);
                setMovie(results);
            } catch (err) {
                setLoading(false);
                setError(ERROR_FAIL_TO_FETCH);
            }
        })()
    }, [currentCategoryId]);

    useEffect(() => {
        const handleScroll = debounce(async () => {
            if (
                window.innerHeight + window.scrollY >=
                document.body.offsetHeight - 200
            ) {
                setCurrentPage(prev => {
                    (async () => {
                        try {
                            let results = await batchedFetchMovie(
                                prev + 1,
                                currentCategoryId === -1 ? undefined : currentCategoryId,
                            );
                            setMovie(prev => {
                                prev.push(...results);
                                return prev;
                            })
                        } catch (err) {
                            setError(ERROR_FAIL_TO_FETCH);
                        }
                    })();
                    return prev + 1;
                });

            }
        });

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (loading) {
        return <Loading />
    }

    if (error) {
        return <Error msg={error} />
    }

    return (
        <div className={style.content}>
            <Flex wrap gap="small" className={style.category}>
                <Card size='small' hoverable className={style.item}
                    onClick={() => setCurrentCategoryId(-1)}
                >
                    <Text strong className={style.text}>All</Text>
                </Card>
                {
                    category.map((category, index, _) => (
                        <Card size='small' className={`${style.item} ${currentCategoryId === category.id ? style.current : ''}`}
                            onClick={() => setCurrentCategoryId(category.id)}
                        >
                            <Text strong className={style.text}>{category.name}</Text>
                        </Card>
                    ))
                }
            </Flex>
            <Flex wrap gap="middle" justify="flex-start" className={style.movie}>
                {
                    movie.map((movie, index, _) => (
                        <Card
                            hoverable
                            variant="borderless"
                            cover={
                                <>
                                    <Link to={`/details/${movie.id}`}>
                                        <Image preview={false} alt={movie.title} src={`${POSTER_BASE_URL}/${movie.poster_path}`}>
                                        </Image>
                                    </Link>
                                </>
                            }
                            className={style.item}
                        >
                        </Card>
                    ))
                }
            </Flex>
        </div>
    )
}