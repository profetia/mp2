import { Card, Typography } from "antd";

import style from './Loading.module.scss';

const { Title } = Typography;

export default function Loading() {
    return (
        <Card className={style.content}>
            < Title level={3} className={style.text} >
                Loading
                <span className={style.dots}></span>
            </Title >
        </Card >
    )
}