import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../../api";
import { DataSourceIF } from "../../types";
import Datas from "./Datas";
import DataSources from "./DataSources";

const DataWrapper = () => {
    const [ dataSources, setDataSources ] = useState<DataSourceIF[]>([]);
    const [ dataSourcesLoading, setDataSourcesLoading ] = useState<boolean>(false);
    const [ dataSourcesError, setDataSourcesError ] = useState<string>('');

    useEffect(() => {
        setDataSourcesLoading(true)
        api.get('/data-source/get-all/')
            .then((response:any) => {
                if(response) {
                    setDataSources(response.data.dataSources);
                } else {
                    setDataSourcesError(response.data.error);
                }
                setDataSourcesLoading(false)
            })
            .catch(error => {
                console.log(error)
                setDataSourcesError(error.message);
            })
    }, [])

    const location = useLocation();

    if(location.pathname === '/data-sources') {
        return <DataSources
            dataSources={dataSources}
            dataSourcesLoading={dataSourcesLoading}
            dataSourcesError={dataSourcesError}
            setDataSources={setDataSources}
        />
    }

    if(location.pathname.startsWith('/data')) {
        return <Datas
            dataSources={dataSources}
            dataSourcesLoading={dataSourcesLoading}
            dataSourcesError={dataSourcesError}
        />
    }

    return <div>Data</div>
}
 
export default DataWrapper;