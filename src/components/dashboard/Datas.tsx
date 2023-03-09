import api from "../../api";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { DataSourceIF } from "../../types";

const Datas:React.FC = () => {
    const { dataSourceId } = useParams();

    const {dataSources, dataSourcesLoading}:DatasContextIF = useOutletContext<DatasContextIF>()

    const navigate = useNavigate();

    const [ datas, setDatas ] = useState([]);
    const [ loadingDatas, setLoadingDatas ] = useState<boolean>(false);
    const [ errorDatas, setErrorDatas ] = useState<string>('');
    const [ headings, setHeadings ] = useState([]);
    const [ datasProcessing, setDatasProcessing ] = useState<string[]>([]);

    const getLocalDate = (d:Date) => {
        return d.getFullYear() + '/' + ('0' + (d.getMonth()+1)).slice(-2) + '/' + ('0' + d.getDate()).slice(-2) + ' ' + ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2)
    }

    const addToDatasProcessing = (dataId:string) => {
        const datasProcessingCopy = datasProcessing.map(d => d)
        datasProcessingCopy.push(dataId);
        setDatasProcessing(datasProcessingCopy);
    }

    const removeFromDatasProcessing = (dataId:string) => {
        const datasProcessingCopy = datasProcessing.map(d => d);
        const index = datasProcessingCopy.indexOf(dataId);
        datasProcessingCopy.splice(index, 1);
        setDatasProcessing(datasProcessingCopy);
    }

    const deleteData = (dataId:string) => {
        addToDatasProcessing(dataId)
        api.delete(`/data/${dataId}`).then((response:any) => {
            if(response.data.success){
                setHeadings(response.data.headings);
                setDatas(response.data.datas);
            }
            removeFromDatasProcessing(dataId)
        }).catch(error => {
            console.log(error)
            setErrorDatas(error)
            removeFromDatasProcessing(dataId)
        });
    }

    useEffect(() => {
        if(dataSources.length){
            setLoadingDatas(true);
            api.get(`/data/get-all/${dataSourceId || dataSources[0]?._id}`).then((response:any) => {
                if(response.data.success){
                    setHeadings(response.data.headings);
                    setDatas(response.data.datas);
                }
                setLoadingDatas(false)
            }).catch(error => {
                console.log(error)
                setLoadingDatas(false)
            });
        }
    }, [dataSourceId])

    if(dataSourcesLoading){
        return <div className="py-4">
            <div className="bg-white shadow rounded py-5 d-flex justify-content-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        </div>
    }

    return (<>
        <div className="bg-white shadow rounded pt-3 pb-2 mt-4">
            <div className="px-4 pb-4">
                <select
                    className="form-select"
                    value={dataSourceId}
                    onChange={e => navigate('/data/' + e.target.value)}
                >
                    {dataSources.map(dataSource => (
                        <option key={dataSource._id} value={dataSource._id}>{dataSource.source}</option>
                    ))}
                </select>
            </div>

            {loadingDatas ?
                <div className="bg-white rounded pb-3 d-flex justify-content-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
                :
                !datas.length ?
                <div className="bg-white rounded pb-3 d-flex justify-content-center">
                    No data available on this source
                </div>
                :
                <table className="table">
                    <thead>
                        <tr>
                            <th className="ps-4">S.No.</th>
                            <th>Created At</th>
                            {headings.map((heading, i) => (
                                <th key={i}>{heading}</th>
                            ))}
                            <th className="pe-4">{/*for actions*/}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {datas.map((data:any, i) => (
                            <tr className="position-relative" key={data._id}>
                                <td className="ps-4">
                                    {i + 1}
                                </td>
                                <td>
                                    {getLocalDate(new Date(data.createdAt))}
                                </td>
                                {headings.map((heading, i) => (
                                    <td key={i}>{data[heading]}</td>
                                ))}
                                <td className="pe-4">
                                    <button className="btn btn-sm btn-danger" onClick={() => deleteData(data._id)}>Delete</button>

                                    {datasProcessing.includes(data._id as string) &&
                                        <div className="bg-white bg-opacity-50 position-absolute start-0 top-0 w-100 h-100 d-flex justify-content-center align-items-center">
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        </div>
                                    }
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            }
        </div>
    </>);
}

interface DatasContextIF {
    dataSources: DataSourceIF[],
    dataSourcesLoading: boolean,
    dataSourcesError: string,
}
 
export default Datas;