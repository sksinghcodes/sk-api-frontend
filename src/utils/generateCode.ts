import { CodeType } from "../types";

const generateCode = (codeType:CodeType, key:string, headings:string[]) => {
    
    if(codeType === CodeType.AXIOS){
        let obj = '{';
        headings.forEach((heading:string) => {
            obj += '\n\t\t' + heading + ': \'\',';
        })
        obj += '\n\t}';

		const codeForAxios = `axios.post('${import.meta.env.VITE_API_BASE_URL}/add-data', {
    key: '${key}',
    data: ${obj},
})
.then(response => {
    if(response.data.success){
        // code for success
    } else {
        // code for failure
    }
})
.catch(error => {
    // code for failure
});`;

        return codeForAxios;
    }

    if(codeType === CodeType.FETCH) {
        let obj = '{';
        headings.forEach((heading:string) => {
            obj += '\n\t\t\t' + heading + ': \'\',';
        })
        obj += '\n\t\t}';
    const codeForFetch = `fetch('${import.meta.env.VITE_API_BASE_URL}/add-data', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        key: '${key}',
        data: ${obj}
    })
})
.then(response => response.json())
.then(result => {
    if(result.success){
        // code for success
    } else {
        // code for failure
    }
})
.catch(error => {
    // code for failure
})`
        return codeForFetch;
    }

    if(codeType === CodeType.XHR) {
        let obj = '{';
        headings.forEach((heading:string) => {
            obj += '\n\t\t' + heading + ': \'\',';
        })
        obj += '\n\t}';
        const codeForXHR = `const xhr = new XMLHttpRequest();
xhr.open('POST', '${import.meta.env.VITE_API_BASE_URL}/add-data');
xhr.setRequestHeader('Content-Type', 'application/json')
xhr.onreadystatechange = function() {
    if(this.readyState === 4){
        if(this.status === 200) {
            const result = JSON.parse(this.responseText);
            if(result.success){
                // code for success
            } else {
                // code for failure
            }
        } else {
            // code for failure
        }
    }
}
xhr.send(JSON.stringify({
    key: '${key}',
    data: ${obj},
}));`
        return codeForXHR;
    }

    return '';
}

export default generateCode;