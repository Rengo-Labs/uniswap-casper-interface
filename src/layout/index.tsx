import React from 'react';
export interface ILayoutProps {
    children?: React.ReactElement;
}
const Layout = ({children} : ILayoutProps) => {
    return (
        <div>
            {children}
        </div>
    );
}

export default Layout;
