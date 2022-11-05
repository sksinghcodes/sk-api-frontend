import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const DataSourceForm = () => {
    const [headings, setheadings] = useState([{id:uuidv4(), value:''}])

    const handleChangeRowValue = (e:React.ChangeEvent<HTMLInputElement>) => {
        const { index } = e.currentTarget.dataset;
        const { value } = e.currentTarget;
        const headingsCopy = headings.map(heading => ({...heading}))

        headingsCopy[index as unknown as number].value = value;
        setheadings(headingsCopy)
    }

    const handleRows = (e:React.SyntheticEvent) => {
        const { action, index } = (e.currentTarget as HTMLButtonElement).dataset;
        const numIndex = index as unknown as number;
        const headingsCopy = headings.map(heading => ({...heading}))

        if(action === 'ADD_ROW') {
            headingsCopy.splice(numIndex, 0, {id: uuidv4(), value: ''});
        }

        if(action === 'REMOVE_ROW') {
            headingsCopy.splice(numIndex, 1);
        }
        console.log(JSON.parse(JSON.stringify(headingsCopy)));

        setheadings(headingsCopy)
    }

    return <>
        <form onSubmit={e => e.preventDefault()}>
            
            <div>
                <label>Source</label>
                <div><input type="text" /></div>
            </div>
            
            <div>
                <label>Headings</label>
                {headings.map((heading, i) => (
                    <div key={heading.id} >
                        <input type="text" value={heading.value} data-index={i} onChange={handleChangeRowValue}/>
                        {headings.length > 1 &&
                            <button type="button" data-action="REMOVE_ROW" data-index={i} onClick={handleRows}>-</button>
                        }
                        <button type="button" data-action="ADD_ROW" data-index={i} onClick={handleRows}>+</button>
                    </div>
                ))}
            </div>

            <div>
                <label>Generate Key</label>
                <div><input type="text" /></div>
            </div>
            
        </form>
    </>;
}
 
export default DataSourceForm;