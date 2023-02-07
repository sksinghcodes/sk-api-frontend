import React, { Fragment, useState, useEffect, useContext } from "react";
import DataSourceForm from "../components/DataSourceForm";
import { v4 as uuidv4 } from "uuid";
import { Link } from 'react-router-dom'
import { DataSourceIF, DataSourceIFLocal } from "../types";
import axios from '../api';
import { Context } from "../context/ContextProvider";

const DataSources = () => {
    const context = useContext(Context);

    const getOne = () => {
        // axios.post('/data-source/636d070686f1ac755171961a')
        //     .then(response => console.log(response))
        //     .catch(err => console.log(err))

        axios.get('/data/get-all/638b275e027cec2ab6395a60')
            .then(response => console.log(response))
            .catch(err => console.log(err))
    }

    const [dataSource, setDataSource] = useState<DataSourceIFLocal>({
        source: '',
        headings: [{id:uuidv4(), value:''}],
    })

    const [dataSources, setDataSources] = useState<DataSourceIF[]>([]);

    const [showAddNewForm, setShowAddNewForm] = useState(false)

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const { index, key, isItemOfArray } = e.currentTarget.dataset;
        const { value } = e.currentTarget;

        const headingsCopy = dataSource.headings.map(heading => ({...heading}));
        const dataSourceCopy = {...dataSource, headings: headingsCopy}

        if(isItemOfArray) {
            dataSourceCopy.headings[index as unknown as number].value = value;
            setDataSource(dataSourceCopy)
        } else {
            setDataSource({
                ...dataSourceCopy,
                [key as string]: value,
            })
        }
    }

    const handleRows = (e:React.SyntheticEvent) => {
        const { action, index } = (e.currentTarget as HTMLButtonElement).dataset;
        const numIndex = index as unknown as number;
        const headingsCopy = dataSource.headings.map(heading => ({...heading}));

        if(action === 'ADD_ROW') {
            headingsCopy.splice(numIndex + 1, 0, {id: uuidv4(), value: ''});
        }

        if(action === 'REMOVE_ROW') {
            headingsCopy.splice(numIndex, 1);
        }

        const dataSourceCopy = {...dataSource, headings: headingsCopy};
        setDataSource(dataSourceCopy);
    }

    const handleSubmit = (e:React.SyntheticEvent) => {
        e.preventDefault();
        const headingsArr = dataSource.headings.map(heading => heading.value);
        const newDataSource:DataSourceIF = {...dataSource, headings: headingsArr}
        axios.post('/data-source', newDataSource)
            .then(response => console.log(response))
            .catch(err => console.log(err))
        
        // newDataSource.id = ((dataSources[dataSources.length - 1].id as unknown as number) + 1) as unknown as string,
        // setDataSources([
        //     ...dataSources,
        //     newDataSource
        // ]);
        // setDataSource({
        //     source: '',
        //     headings: [{id:uuidv4(), value:''}],
        // });
        // setShowAddNewForm(false);
    }

    useEffect(() => {
        axios.get('/data-source/get-all/')
            .then((response:any) => {
                if(response) {
                    setDataSources(response.data.dataSources);
                    console.log(response)
                } else {
                    console.log(response.data.error)
                }
            })
            .catch(err => console.log(err))


    }, [])

    return ( <div>
        <button onClick={getOne}>Get One</button>
        <h1>Data Sources</h1>
        <div style={{border: '1px solid #555'}}>
            {dataSources.map(dataSource => <Fragment key={dataSource._id}>
                <div>
                    <div>{dataSource.source}</div>
                    <div style={{overflowWrap: 'anywhere'}}>{dataSource.key}</div>
                    <div>{dataSource.headings.join(', ')}</div>
                    <Link to={`/dashboard/data/${dataSource._id}`}>Show Datasource</Link>
                </div>

                <hr />
            </Fragment>)}
            {
                !showAddNewForm &&
                <div style={{textAlign: 'right'}}><button onClick={() => setShowAddNewForm(true)}>Add New</button></div>
            }
            {
                showAddNewForm &&
                <DataSourceForm
                    dataSource={dataSource}
                    handleChange={handleChange}
                    handleRows={handleRows}
                    handleSubmit={handleSubmit}
                />
            }
        </div>
    </div> );
}
 
export default DataSources;