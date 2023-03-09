import NavBar from "../components/navbar/NavBar";
import { Outlet } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { Context } from "../context/ContextProvider";
import { DataSourceIF } from "../types";
import api from "../api";

const Dashboard:React.FC = () => {
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

    return <Outlet 
                context={{
                    dataSources,
                    dataSourcesLoading,
                    dataSourcesError,
                    setDataSources
                }}
    />
}
 
export default Dashboard;