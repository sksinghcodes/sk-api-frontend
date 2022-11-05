import { Fragment } from "react";
import DataSourceForm from "../components/DataSourceForm";

const UserDashboard = () => {
    const dataSources = [
        {
            id: 1,
            source: 'https://www.google.com/efwe',
            key: 'hgushrelfiajmiguhsmeurgh',
            headings: ['firstName', 'lastName', 'email', 'subject', 'message'],
        },
        {
            id: 2,
            source: 'https://www.google.com/efwe',
            key: 'hgushrelfiajmiguhsmeurgh',
            headings: ['firstName', 'lastName', 'email', 'subject', 'message'],
        },
        {
            id: 3,
            source: 'https://www.google.com/efwe',
            key: 'hgushrelfiajmiguhsmeurgh',
            headings: ['firstName', 'lastName', 'email', 'subject', 'message'],
        },
        {
            id: 4,
            source: 'https://www.google.com/efwe',
            key: 'hgushrelfiajmiguhsmeurgh',
            headings: ['firstName', 'lastName', 'email', 'subject', 'message'],
        },
    ]

    return ( <div>
        <h1>Data Sources</h1>
        <button>Add New</button>
        <DataSourceForm />
        <div style={{border: '1px solid #555'}}>
            {dataSources.map(dataSource => <Fragment key={dataSource.id}>
                <div>
                    <div>{dataSource.source}</div>
                    <div>{dataSource.key}</div>
                    <div>{dataSource.headings.join(', ')}</div>
                </div>
                <hr />
            </Fragment>)}
        </div>
    </div> );
}
 
export default UserDashboard;