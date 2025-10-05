import { Card, Typography } from "antd";

import style from './index.module.scss';

const { Title } = Typography;

export default function Error() {
    return (
        <Card className={style.content}>
            < Title level={3} className={style.text} >
                <span className={style.oops}>Oops!</span>
                < br />
                We can't find the page you're looking for
            </Title >
        </Card >
    )
}