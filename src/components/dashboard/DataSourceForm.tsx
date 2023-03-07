import React from "react";
import { DataSourceFormErrors, DataSourceLocalIF, FormMode } from "../../types";
import ErrorText from "../helpers/ErrorText";
import SpinnerButton from "../helpers/SpinnerButton";

const DataSourceForm = React.forwardRef<HTMLDivElement, DataSourceFormPropsInterface>((
    {
        dataSource,
        adding,
        errors,
        mainError,
        handleChange,
        handleRows,
        handleSubmit,
    },
    ref
) => {
    return <>
        <div className="modal fade" id="AddNewDataSource" tabIndex={-1} aria-labelledby="AddNewDataSourceLabel" aria-hidden="true" ref={ref}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="AddNewDataSourceLabel">Add Data Source</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Source</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    data-key="source"
                                    value={dataSource.source}
                                    placeholder="e.g. https://www.example.com/"
                                    onChange={handleChange}
                                />
                                {errors.source && <ErrorText>{errors.source}</ErrorText>}
                            </div>
                            
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Headings</label>
                                {dataSource.headings.map((heading, i) => (
                                    <div key={heading.id} className="mb-2">
                                        <div className="d-flex">
                                            <input
                                                className="form-control"
                                                placeholder={`e.g. phone_number`}
                                                type="text"
                                                data-key="headings"
                                                data-index={i}
                                                data-is-item-of-array
                                                value={heading.value}
                                                onChange={handleChange}
                                            />
                                            {dataSource.headings.length > 1 &&
                                                <button
                                                    className="btn btn-danger ms-1"
                                                    type="button"
                                                    onClick={() => handleRows('REMOVE_ROW', i)}
                                                >-</button>
                                            }
                                            <button
                                                className="btn btn-success ms-1"
                                                type="button"
                                                onClick={() => handleRows('ADD_ROW', i)}
                                            >+</button>
                                        </div>
                                        {errors.headings[i] && <ErrorText>{errors.headings[i]}</ErrorText>}
                                    </div>
                                ))}
                            </div>
                            
                            <div className="text-center">
                                <SpinnerButton
                                    disabled={adding}
                                    loading={adding}
                                >Add New</SpinnerButton>
                            </div>
                            {mainError && <ErrorText>{mainError}</ErrorText>}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </>;
})

interface DataSourceFormPropsInterface {
    dataSource: DataSourceLocalIF,
    adding: boolean,
    errors: DataSourceFormErrors,
    mainError: string,
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    handleRows: (action:string, index:number) => void,
    handleSubmit: (e: React.SyntheticEvent) => void,
}

export default DataSourceForm;