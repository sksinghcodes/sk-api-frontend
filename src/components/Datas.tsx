import axios from "../api";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Datas = () => {
    const { dataSourceId } = useParams();

    const [ datas, setDatas ] = useState([]);
    const [ headings, setHeadings ] = useState([]);

    const getAllDatas = () => {
        axios.get(`/data/get-all/${dataSourceId}`)
            .then((response:any) => {
                if(response.data.success){
                    setHeadings(response.data.headings);
                    setDatas(response.data.datas);
                }
            })
            .catch(err => console.log(err));
    }

    const deleteOneData = (id:string) => {
        axios.delete(`/data/${id}`)
            .then((response:any) => {
                if(response.data.success){
                    setHeadings(response.data.headings);
                    setDatas(response.data.datas);
                }
            })
            .catch(err => console.log(err));
    }

    useEffect(() => {
        getAllDatas();
    }, [])



    return (<>
        <table>
            <thead>
                <tr>
                    {headings.map((heading, i) => (
                        <th key={i}>{heading}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {datas.map((data:any) => (
                    <tr key={data._id}>
                        {headings.map((heading, i) => (
                            <td key={i}>{data[heading]}</td>
                        ))}
                        <td>
                            <button onClick={() => deleteOneData(data._id)}>Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </>);
}
 
export default Datas;