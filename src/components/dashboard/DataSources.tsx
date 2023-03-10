import React, { useState, useEffect } from "react";
import DataSourceForm from "./DataSourceForm";
import { v4 as uuidv4 } from "uuid";
import { Link, useOutletContext } from 'react-router-dom'
import { DataSourceFormErrors, DataSourceIF, DataSourceLocalIF, FormMode } from "../../types";
import { Modal, Tooltip } from 'bootstrap';
import api from "../../api";

const DataSources:React.FC = () => {
    const initialDataSource = {
        source: '',
        headings: [{id:uuidv4(), value:''}],
    }
    const initialDataSourceFormErrors = {
        source: '',
        headings: ['']
    }

    const {
        dataSources,
        dataSourcesLoading,
        setDataSources,
    }:DataSourcesContextIF = useOutletContext<DataSourcesContextIF>();

    const [ copiedText, setCopiedText ] = useState<string>('');
    const [ dataSource, setDataSource ] = useState<DataSourceLocalIF>(initialDataSource)
    const [ addingDataSource, setAddingDataSource ] = useState<boolean>(false);
    const [ dataSourcesProcessing, setDataSourcesProcessing ] = useState<string[]>([]);
    const [ dataSourceFormErrors, setDataSourceFormErrors ] = useState<DataSourceFormErrors>(initialDataSourceFormErrors);
    const [ dataSourceFormMainError, setDataSourceFormMainError ] = useState<string>('');

    const dataSourceFormRef:React.Ref<HTMLDivElement> = React.useRef<HTMLDivElement>(document.createElement('div'))

    const cleanDataSourceForm = (e:any) => {
        setDataSource(initialDataSource);
        setDataSourceFormErrors(initialDataSourceFormErrors);
        setAddingDataSource(false);
    }

    const openDataSourceFormModal = () => {
        const dataSourceFormModal = Modal.getOrCreateInstance(dataSourceFormRef.current as Element);
        dataSourceFormModal.show();
    }

    const closeDataSourceFormModal = () => {
        const dataSourceFormModal = Modal.getOrCreateInstance(dataSourceFormRef.current as Element);
        dataSourceFormModal.hide();
    }

    const addToDataSourcesProcessing = (dataSourceId:string) => {
        const dataSourcesProcessingCopy = dataSourcesProcessing.map(d => d)
        dataSourcesProcessingCopy.push(dataSourceId);
        setDataSourcesProcessing(dataSourcesProcessingCopy);
    }

    const removeFromDataSourcesProcessing = (dataSourceId:string) => {
        const dataSourcesProcessingCopy = dataSourcesProcessing.map(d => d);
        const index = dataSourcesProcessingCopy.indexOf(dataSourceId);
        dataSourcesProcessingCopy.splice(index, 1);
        setDataSourcesProcessing(dataSourcesProcessingCopy);
    }

    const deleteDataSource = (dataSourceId:string) => {
        addToDataSourcesProcessing(dataSourceId)
        api.delete(`/data-source/${dataSourceId}`).then(response => {
            setDataSources(response.data.dataSources);
            removeFromDataSourcesProcessing(dataSourceId);
        }).catch(error => {
            console.log(error)
            removeFromDataSourcesProcessing(dataSourceId)
        })
    }

    useEffect(() => {
        if(dataSourceFormRef.current){
            dataSourceFormRef.current.addEventListener('hide.bs.modal', cleanDataSourceForm);
        }
    }, [dataSourceFormRef.current])

    useEffect(() => {
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
        const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new Tooltip(tooltipTriggerEl))
    }, [dataSources.length])

    const validate = (dataSource:DataSourceLocalIF) => {
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
                dataSourceErrors.headings[i] = 'Invalid heading: No spaces are allowed. Only allowed characters are alphabets, numbers and underscore (_)';
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
            setAddingDataSource(true)
            const headingsArr = dataSource.headings.map((heading) => heading.value);
            const newDataSource:DataSourceIF = {...dataSource, headings: headingsArr}
            api.post('/data-source', newDataSource).then(response => {
                if(response.data.success){
                    setDataSources(response.data.dataSources)
                    closeDataSourceFormModal()
                } else {
                    setDataSourceFormMainError(response.data.error)
                }
                setAddingDataSource(false)
            }).catch(err => {
                console.log(err)
                setAddingDataSource(false)
                setDataSourceFormMainError(err)
                closeDataSourceFormModal()
            });
        }
    }

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


    if(dataSourcesLoading){
        return <div className="py-4">
            <div className="bg-white shadow rounded py-5 d-flex justify-content-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        </div>
    }

    return (<div className="py-4">
        <div className="bg-white shadow rounded pt-4">
            <div className="px-4 mb-2 d-flex justify-content-between align-items-center">
                <h1 className="h3">Data Sources</h1>
                <button
                    className="btn btn-primary"
                    onClick={openDataSourceFormModal}
                >Add Data Source</button>
            </div>

            {dataSources.length ?
                <table className="table mb-0">
                    {dataSources.map((dataSource, i) => <tbody className="position-relative" key={dataSource._id}>
                        <tr>
                            <th scope="row" className="ps-4 pt-4">Source</th>
                            <td className="pe-4 pt-4"><a href={dataSource.source} target="_blank">{dataSource.source}</a></td>
                        </tr>
                        <tr >
                            <th scope="row" className="ps-4">API key</th>
                            <td className="pe-4" style={{overflowWrap: 'anywhere'}}>
                                <div className="position-relative pe-5">
                                    {dataSource.key}
                                    <button
                                        className="btn position-absolute top-0 end-0"
                                        hidden={copiedText === dataSource.key}
                                        data-bs-toggle="tooltip"
                                        data-bs-title={'Copy to clipboard'}
                                        onClick={() => {
                                            navigator.clipboard.writeText(dataSource.key || '');
                                            setCopiedText(dataSource.key || '')
                                        }}
                                    >
                                        <i className="bi bi-clipboard"></i>
                                    </button>
                                    <button
                                        className="btn position-absolute top-0 end-0"
                                        hidden={copiedText !== dataSource.key}
                                        data-bs-toggle="tooltip"
                                        data-bs-title={'Copied'}
                                    >
                                        <i className="bi bi-clipboard-check"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row" className="ps-4">Headings</th>
                            <td className="pe-4">{dataSource.headings.map((text, i) => {
                                return <div key={i} className="badge text-bg-secondary me-1 text-1">{text}</div>
                            })}</td>
                        </tr>
                        <tr>
                            <th className="pb-4"></th>
                            <td className="pe-4 pb-4">
                                <Link className="btn btn-sm btn-primary me-2" to={`/dashboard/data/${dataSource._id}`}>Show Data</Link>
                                <button onClick={() => deleteDataSource(dataSource._id as string)} className="btn btn-sm btn-danger me-2">Delete</button>

                                {dataSourcesProcessing.includes(dataSource._id as string) &&
                                    <div className="bg-white bg-opacity-50 position-absolute start-0 top-0 w-100 h-100 d-flex justify-content-center align-items-center">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                }
                            </td>
                        </tr>
                        {dataSources.length - 1 !== i &&
                            <tr>
                                <td colSpan={2} className="p-0">
                                    <hr className="m-0 border border-dark border-3" />
                                </td>
                            </tr>
                        }
                    </tbody>)}
                </table>
                :
                <p className="px-4 pb-4">No data-source added so far</p>
            }
            <DataSourceForm
                ref={dataSourceFormRef}
                dataSource={dataSource}
                adding={addingDataSource}
                errors={dataSourceFormErrors}
                mainError={dataSourceFormMainError}
                handleChange={handleChange}
                handleRows={handleRows}
                handleSubmit={handleSubmit}
            />
        </div> 
    </div>);
}

interface DataSourcesContextIF {
    dataSources: DataSourceIF[],
    dataSourcesLoading: boolean,
    dataSourcesError: string,
    setDataSources: React.Dispatch<React.SetStateAction<DataSourceIF[]>>
}
 
export default DataSources;