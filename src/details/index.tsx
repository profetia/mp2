import { useEffect, useState } from 'react';
import { Link, useParams } from "react-router-dom";

import { Card, Button, Flex, Image, Typography } from "antd";
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

import Error, { ERROR_FAIL_TO_FETCH, ERROR_NOT_FOUND } from '../common/Error';
import Loading from '../common/Loading';

import { fetchDetails, POSTER_BASE_URL } from '../common/ApiUtils';

import style from './index.module.scss';

const { Paragraph, Title } = Typography;

export default function Details() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { id: movieId } = useParams();
    const [movie, setMovie] = useState<any>(null);

    useEffect(() => {
        (async () => {
            if (!movieId) {
                setError(ERROR_NOT_FOUND);
                return;
            }

            let movieId_ = parseInt(movieId);
            if (isNaN(movieId_)) {
                setError(ERROR_NOT_FOUND);
                return;
            }

            try {
                let response = await fetchDetails({
                    movie_id: movieId_,
                });
                console.log(response);
                let data = response.data;
                setLoading(false);
                setMovie(data);
            } catch (err: any) {
                setLoading(false);
                if (err.status == 404) {
                    setError(ERROR_NOT_FOUND);
                    return;
                }
                setError(ERROR_FAIL_TO_FETCH);
            }
        })();
    }, [movieId]);

    if (loading) {
        return <Loading />
    }

    if (error) {
        return <Error msg={error} />
    }

    return (
        <Card className={style.content}
            title={
                <Link to={`/details/${parseInt(movieId as string) - 1}`}>
                    <Button color="cyan" variant="solid" shape="round">
                        <LeftOutlined />
                    </Button>
                </Link>
            }
            extra={

                <Link to={`/details/${parseInt(movieId as string) + 1}`}>
                    <Button color="cyan" variant="solid" shape="round">
                        <RightOutlined />
                    </Button>
                </ Link>
            }
        >
            <div className={style.body}>
                <Title level={2}>{movie.title}</Title>
                <Title level={5}>Popularity: {Math.round(movie.popularity * 100) / 100}</Title>
                <div>
                    <Flex>
                        <Image
                            width={150}
                            src={`${POSTER_BASE_URL}${movie.poster_path}`}
                            alt={movie.title}
                            preview={false}
                        />
                        <div className={style.details}>
                            <Title level={5} className={style.overview}>{movie.overview || "N/A"}</Title>
                            <div className={style.info}>
                                <Paragraph strong className={style.release}>
                                    Released: {movie.release_date}
                                </Paragraph>
                                <Paragraph strong className={style.runtime}>
                                    Runtime: {movie.runtime} minutes
                                </Paragraph>
                                <Paragraph strong className={style.production}>
                                    Production Countries: {movie.production_countries.map((country: any, index: number) => (
                                        <span key={index}>
                                            {country.name}
                                            {index < movie.production_countries.length - 1 ? ', ' : ''}
                                        </span>
                                    ))}
                                </Paragraph>
                            </div>
                        </div>
                    </Flex>
                </div>
            </div>
        </Card >
    )
}