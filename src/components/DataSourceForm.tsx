import { DataSourceIFLocal } from "../types";

const DataSourceForm:React.FC<DataSourceFormPropsInterface> = ({dataSource, handleChange, handleRows, handleSubmit}) => {
    return <>
        <form onSubmit={handleSubmit}>
            
            <div>
                <label>Source</label>
                <div><input type="text" data-key="source" value={dataSource.source} onChange={handleChange} /></div>
            </div>
            
            <div>
                <label>Headings</label>
                {dataSource.headings.map((heading, i) => (
                    <div key={heading.id} >
                        <input
                            type="text"
                            data-key="source"
                            data-index={i}
                            data-is-item-of-array
                            value={heading.value}
                            onChange={handleChange}
                        />
                        {dataSource.headings.length > 1 &&
                            <button type="button" data-action="REMOVE_ROW" data-index={i} onClick={handleRows}>-</button>
                        }
                        <button type="button" data-action="ADD_ROW" data-index={i} onClick={handleRows}>+</button>
                    </div>
                ))}
            </div>
            
            <div>
                <input type="submit" value="Submit" />
            </div>

        </form>
    </>;
}

interface DataSourceFormPropsInterface {
    dataSource: DataSourceIFLocal,
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    handleRows: (e: React.SyntheticEvent) => void,
    handleSubmit: (e: React.SyntheticEvent) => void,
}

export default DataSourceForm;