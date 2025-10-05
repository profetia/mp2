import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";

import { Card, Flex, Image, Input, Radio, Select, Typography } from "antd";

import Error, { ERROR_FAIL_TO_FETCH } from '../common/Error';

import { fetchSearchMovie, POSTER_BASE_URL } from '../common/ApiUtils';
import { debounce } from '../common/IoUtils';

import style from './index.module.scss';

const { Title } = Typography;

function keyFnToCompareFn<T, U>(keyFn: (arg: T) => U) {
    return (x: T, y: T) => {
        let keyX = keyFn(x);
        let keyY = keyFn(y);
        if (keyX < keyY) {
            return -1;
        }
        if (keyX == keyY) {
            return 0;
        }
        return 1;
    };
}

function levelCompareFn<T>(keyFns: ((x: T, y: T) => number)[]) {
    return (x: T, y: T) => {
        for (let fn of keyFns) {
            let ret = fn(x, y);
            if (ret != 0) {
                return ret;
            }
        }

        return 0;
    }
}

function applySortOptions(array: any[], sortBy: string, sortOrder: string) {
    console.log(sortBy, sortOrder);
    const sortByTitle = keyFnToCompareFn((x: any) => x.title);
    const sortByPopularity = keyFnToCompareFn((x: any) => parseFloat(x.popularity));
    const sortByOperators = {
        title: levelCompareFn([sortByTitle, sortByPopularity]),
        popularity: levelCompareFn([sortByPopularity, sortByTitle]),
    } as any;

    const sortOrderOperators = {
        ascending: (array: any[]) => array,
        descending: (array: any[]) => array.reverse(),
    } as any;

    let sortByFn = sortByOperators[sortBy];
    let sortOrderFn = sortOrderOperators[sortOrder];

    return sortOrderFn(
        array.sort(sortByFn)
    );
}

export default function List() {
    const [error, setError] = useState<string | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [currentSortBy, setCurrentSortBy] = useState('title');
    const [currentSortOrder, setCurrentSortOrder] = useState('ascending');

    let currentQuery = "";
    let currentTotalPage = 1;

    const [movie, setMovie] = useState<any[]>([]);

    const handleSearch = debounce(async (event) => {
        let query = event.target.value;
        setCurrentPage(1);
        currentQuery = query;
        try {
            let response = await fetchSearchMovie({
                page: 1,
                query
            });
            console.log(response);
            let data = response.data;
            setMovie(applySortOptions(data.results, currentSortBy, currentSortOrder));
            currentTotalPage = data.total_pages;
        } catch (err: any) {
            setError(ERROR_FAIL_TO_FETCH);
        }
    });

    const handleSortBy = debounce((value: string) => {
        setCurrentSortBy(value);
        setMovie(prev => applySortOptions([...prev], value, currentSortOrder));
    });

    const handleSortOrder = debounce((event: any) => {
        setCurrentSortOrder(event.target.value);
        setMovie(prev => applySortOptions([...prev], currentSortBy, event.target.value));
    });

    useEffect(() => {
        const handleScroll = debounce(async () => {
            if (
                window.innerHeight + window.scrollY >=
                document.body.offsetHeight - 200
            ) {
                setCurrentPage(prev => {
                    (async () => {
                        if (prev + 1 > currentTotalPage) {
                            return;
                        }

                        try {
                            let response = await fetchSearchMovie({
                                page: prev + 1,
                                query: currentQuery
                            });
                            console.log(response);
                            let data = response.data;
                            setMovie(prev => {
                                prev.push(...data.results);
                                return applySortOptions([...prev], currentSortBy, currentSortOrder)
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

    if (error) {
        return <Error msg={error} />
    }

    return (
        <>
            <Card className={style.content}>
                <div className={style.body}>
                    <Input size='large' placeholder='Search for movies' onChange={handleSearch}
                    >
                    </Input>
                    <Title level={4}>Sort by:</Title>
                    <Select
                        defaultValue="title"
                        value={currentSortBy}
                        size='large'
                        options={[
                            { value: "title", label: "Title" },
                            { value: "popularity", label: "Popularity" }
                        ]}
                        onChange={handleSortBy}
                        className={style.select}
                    >
                    </Select>
                    <div className={style.radio}>
                        <Radio.Group
                            size='large'
                            defaultValue="ascending"
                            value={currentSortOrder}
                            options={[
                                { value: "ascending", label: "ascending" },
                                { value: "descending", label: "descending" }
                            ]}
                            onChange={handleSortOrder}
                        >
                        </Radio.Group>
                    </div>
                </div>
            </Card>
            <div className={style.list}>
                {
                    movie.map((movie, index, _) => {
                        if (movie.adult) {
                            return <></>;
                        }

                        return (
                            <Link to={`/details/${movie.id}`}>
                                <Card
                                    hoverable
                                    className={style.item}
                                >
                                    <Flex>
                                        <Image
                                            width={125}
                                            src={`${POSTER_BASE_URL}${movie.poster_path}`}
                                            alt={movie.title}
                                            preview={false}
                                            className={style.poster}
                                        />
                                        <div className={style.info}>
                                            <Title level={2} className={style.title}>{movie.title}</Title>
                                            <Title level={5}>Popularity: {Math.round(movie.popularity * 100) / 100}</Title>
                                        </div>
                                    </Flex>
                                </Card>
                            </Link>
                        )
                    })
                }
            </div>
        </>
    )
}