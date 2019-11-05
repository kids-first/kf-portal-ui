import React from 'react';
import backgroundScene from 'assets/background-scene.png';
import logo from 'assets/logo-kids-first-drc.svg';
import {kfWebRoot} from 'common/injectGlobals';
import {PageContainer} from 'common/errorBoundary';
import PropTypes from 'prop-types';

const ErrorPage = ({title, description}) => (
    <PageContainer>
        <img className="background-img" src={backgroundScene} alt="background"/>

        <div className="content-container">
            <a href={kfWebRoot}>
                <img alt="Kids First DRC logo" src={logo} width="250"/>
            </a>
            <br/>
            <br/>
            <h1>{title}</h1>
            {Boolean(description) && <p>{description}</p>}
        </div>
    </PageContainer>
);

ErrorPage.defaultProps = {
    title: 'An error occurred',
    description: '',
};

ErrorPage.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
};

export default ErrorPage;