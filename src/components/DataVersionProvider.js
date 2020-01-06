import React from 'react';
import { Spin } from 'antd';
import { getLatestVersion } from 'services/releases';

export default class DataVersionProvider extends React.Component {
    state = {
        version: '',
        loading: false,
        error: null,
    };

    componentDidMount = async () => {
        this.setState({ loading: true });
        let latestVersion = '';
        let error = null;
        try {
            latestVersion = await getLatestVersion();
        } catch (e) {
            error = e;
        }
        this.setState({ loading: false, version: latestVersion, error });
    };

    render() {
        const { loading, error, version } = this.state;
        if (loading) {
            return <Spin style={{ marginLeft: '10px' }} />;
        } else if (error) {
            console.error(error);
            return '--';
        }
        return version;
    }
}
