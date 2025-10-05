import { Card, Typography } from "antd";

import style from './Error.module.scss';

const { Title } = Typography;

export default function Error({ msg }: { msg: string }) {
    return (
        <Card className={style.content}>
            < Title level={3} className={style.text} >
                <span className={style.oops}>Oops!</span>
                < br />
                {msg}
            </Title >
        </Card >
    )
}

export const ERROR_FAIL_TO_FETCH = "Fail to fetch from TMDB";
export const ERROR_NOT_FOUND = "We can't find the page you're looking for";