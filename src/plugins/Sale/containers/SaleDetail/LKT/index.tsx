import { Menu } from 'antd';
import * as React from 'react';

import { LKTInfo } from './Info';
/* import { LKTAbout } from './About'; */
import { LKTMore } from './More';

export const LKT = () => {
    const [selectedViewState, setSelectedViewState] = React.useState<string>('1');
    const handleSelectMenuItem = ({ key, domEvent }) => {
        setSelectedViewState(key);
    }

    return (
        <React.Fragment>
            <div className="row">
                <div className="col-12 text-center">
                    <Menu mode="horizontal" defaultSelectedKeys={['1']} onClick={handleSelectMenuItem}>
                        <Menu.Item key="1"><div style={{ fontSize: '20px' }}>Tokensale Information</div></Menu.Item>
                        {/* <Menu.Item key="2"><span style={{ fontSize: '20px' }}>About CircleEx</span></Menu.Item> */}
                        <Menu.Item key="2"><span style={{ fontSize: '20px' }}>More Information</span></Menu.Item>
                    </Menu>
                </div>
            </div>
            <div style={{ padding: '3rem 5vw' }}>
                {selectedViewState === "1" ? <LKTInfo /> : ''}
                {selectedViewState === "2" ? <LKTMore /> : ''}
            </div>
        </React.Fragment>

    )
}
