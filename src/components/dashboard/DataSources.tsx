import React, { Fragment, useState, useEffect, useContext } from "react";
import DataSourceForm from "./DataSourceForm";
import { v4 as uuidv4 } from "uuid";
import { Link } from 'react-router-dom'
import { DataSourceFormErrors, DataSourceIF, DataSourceIFLocal } from "../../types";
import axios from '../../api';

const DataSources = () => {

    const [ dataSource, setDataSource ] = useState<DataSourceIFLocal>({
        source: '',
        headings: [{id:uuidv4(), value:''}],
    })
    const [ addingDataSource, setAddingDataSource ] = useState<boolean>(false);
    const [ dataSourceFormErrors, setDataSourceFormErrors ] = useState<DataSourceFormErrors>({
        source: '',
        headings: ['']
    });
    const [ dataSourceFormMainError, setDataSourceFormMainError ] = useState<string>('');
    const [ showAddNewForm, setShowAddNewForm ] = useState<boolean>(false)

    const validate = (dataSource:DataSourceIFLocal) => {
        const { source, headings } = dataSource;
        const dataSourceErrors:DataSourceFormErrors = {
            source: '',
            headings: [''],
        }
        let isValid = true;

        if (!source){
            dataSourceErrors.source = 'This field is required';
            isValid = false;
        } else if (source && !/^(https?|ftp):\/\/[^\s\/$.?#].[^\s]*$/.test(source)) {
            dataSourceErrors.source = 'Invalid URL'
            isValid = false;
        } else {
            dataSourceErrors.source = '';
        }

        headings.forEach((heading, i) => {
            if(!heading.value){
                dataSourceErrors.headings[i] = 'This field is required';
                isValid = false;
            } else if (heading && !/^[a-zA-Z0-9_]+$/.test(heading.value)) {
                dataSourceErrors.headings[i] = 'Invalid heading: No spaces are allowed and only allowed characters are alphabets, numbers and underscore (_)';
                isValid = false;
            } else {
                dataSourceErrors.headings[i] = '';
            }
        })

        setDataSourceFormErrors(dataSourceErrors);
        return isValid;
    }

    const handleSubmit = (e:React.SyntheticEvent) => {
        e.preventDefault();
        if(validate(dataSource)){
            const headingsArr = dataSource.headings.map(heading => heading.value);
            const newDataSource:DataSourceIF = {...dataSource, headings: headingsArr}
            axios.post('/data-source', newDataSource)
                .then(response => console.log(response))
                .catch(err => console.log(err))
        }
    }



    const [ dataSources, setDataSources ] = useState<DataSourceIF[]>([]);
    const [ loadingAll, setLoadingAll ] = useState<boolean>(false);
    

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

    const handleRows = (action:string, index:number) => {
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
        <h1>Data Sources</h1>
        <div >
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
                <div style={{textAlign: 'right'}}>
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowAddNewForm(true)}
                    >Add New</button>
                </div>
            }
        </div>
        {
            showAddNewForm &&
            <DataSourceForm
                dataSource={dataSource}
                adding={addingDataSource}
                errors={dataSourceFormErrors}
                mainError={dataSourceFormMainError}
                handleChange={handleChange}
                handleRows={handleRows}
                handleSubmit={handleSubmit}
            />
        }
    </div> );
}
 
export default DataSources;