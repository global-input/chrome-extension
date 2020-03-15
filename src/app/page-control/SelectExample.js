import React from 'react';
import {SelectItems} from '../app-layout';
import * as pageControlUtil from './pageControlUtil';
export default ({data,onChangeData})=>{
    if(!data || data.type!=='new'){
        return null;
    }
    const onChange=evt=>{
        const data=pageControlUtil.getExampleForEditByIndex(evt.target.value);
        onChangeData(data);
    }
    const items=pageControlUtil.getExampleItems();
    return (<SelectItems id="exampleSelect" items={items} value={data.index} label="Load Example:" onChange={onChange}/>);
}