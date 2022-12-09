import React, { useState } from 'react'
import { ReactSpreadsheetImport } from "react-spreadsheet-import";
import './Ceam.css';
import { SlButton, SlDialog,SlMenuItem, SlSelect } from '@shoelace-style/shoelace/dist/react/index.js';
import thirtyonedays from './templates/31daysTemplate.xlsx'
import thirtydays from './templates/30daysTemplate.xlsx'
import twentyeightdays from './templates/28daysTemplate.xlsx'
import twentyninedays from './templates/9daysTemplate.xlsx'
import axios from 'axios'
import MUIDataTable from 'mui-datatables'

import { useEffect } from 'react';

function CeamRoster() {

  const [open, setOpen] = useState(false)
  const [openOT, setOpenOT] = useState(false)

  const [rosterData, setRosterData] = useState()
  const [rosterDataOT, setRosterDataOT] = useState()
  const [uploadDateData, setUploadDateData] = useState('2022-10')
  const [uploadMonth, setUploadMonth] = useState('2022-10')
  const [uploadYear, setUploadYear] = useState()
  const [openUpload, setOpenUpload] = useState(false)
  const [openUploadOT, setOpenUploadOT] = useState(false)
  const [selectMonth, setSelectMonth] = useState(false)
  const [href, setHref] = useState()
  const [downMonth, setDownMonth] = useState('2022-02')
  const [col, setCol] = useState()
  const [month, setMonth] =useState('2022-11')


  useEffect(()=>{
    getRoster()
    getRosterOT()
  },[month])


  const options = {
    tableBodyMaxHeight: '64vh',
    responsive: 'standard',
    selectableRowsHideCheckboxes: true,
}



  function getRoster(){
    let arr = month.split("-");
    const data ={
      month: parseInt(arr[1]),
      year: parseInt(arr[0])
    }
    
    console.log(data);
    axios({
      method: 'post',
      url: `https://internal.microtek.tech:8443/v1/api/mhere/get-roster`,
      headers: {
        'Content-Type': 'application/json',
      },
      data,
    })
    .then((res)=>{
      console.log(res.data.data);
        
      const columns = Object.keys(res.data.data[0]) 
      const popped = columns.pop()
      columns.unshift(popped)
      setCol(columns)
      setRosterData(res.data.data)
    })
    .catch((err)=>{
      alert(err.response.data.message)
      console.log(err);
    })
  }
  function getRosterOT(){
    let arr = month.split("-");
    const data ={
      month: parseInt(arr[1]),
      year: parseInt(arr[0])
    }
    
    console.log(data);
    axios({
      method: 'post',
      url: `https://internal.microtek.tech:8443/v1/api/mhere/get-ot-roster`,
      headers: {
        'Content-Type': 'application/json',
      },
      data,
    })
    .then((res)=>{
      console.log(res.data.data);
        
      const columns = Object.keys(res.data.data[0]) 
      const popped = columns.pop()
      columns.unshift(popped)
      setCol(columns)
      setRosterDataOT(res.data.data)
    })
    .catch((err)=>{
      alert(err.response.data.message)
      console.log(err);
    })
  }

  function onClose(){
    setOpen(false)
  }
  function onCloseOT(){
    setOpenOT(false)
  }

  function onSubmitOT(dataone){
    console.log(dataone);
    const data = {
      month:uploadMonth,
      year:uploadYear,
      ot_roster_data: dataone.all
    }
    console.log(data);
    axios({
      method: 'post',
      url: `https://internal.microtek.tech:8443/v1/api/mhere/upload-ot-roster`,
      headers: {
        'Content-Type': 'application/json',
      },
      data,
    })
    .then((res)=>{
      console.log(res);
    })
    .catch((err)=>{
      alert(err.response.data.message)
      console.log(err);
    })

  }

  function onSubmit(dataone){
    console.log(dataone.all);
    const data = {
      month:uploadMonth,
      year:uploadYear,
      roster_data: dataone.all
    }
    console.log(data);
    axios({
      method: 'post',
      url: `https://internal.microtek.tech:8443/v1/api/mhere/upload-roster`,
      headers: {
        'Content-Type': 'application/json',
      },
      data,
    })
    .then((res)=>{
      console.log(res);
    })
    .catch((err)=>{
      alert(err.response.data.message)
      console.log(err);
    })

  }
  const fields = [
    {
      label: "emp_id",
      key: "emp_id",
      fieldType: {
        type: "input",
      },

    }
  ]
  let uploaddays =  new Date(uploadYear, uploadMonth, 0).getDate(); 
  for (let i = 1; i<=uploaddays ; i++) {
  
    fields.push(
      {
        label:`${i}`,
        key: `${i}`,
        fieldType: {
          type: "input",
        },
      }
    )
    
  }

  function downloadTemplate(){
      console.log(downMonth);
    
  }
  const getDays = (year, month) => {
    let days =  new Date(year, month, 0).getDate();
    if(days == 31){
        setHref(thirtyonedays)
    }
    else if(days == 30){
        setHref(thirtydays)
    }
    else if(days == 28){
        setHref(twentyeightdays)
    }
    else if(days == 29){
        setHref(twentyninedays)
    }
    else{
      alert("select correct")
    }
};



  return (
    <div className="ceam-roster-main">

    <div className="ceam-roster-date-main">
        <input
        onChange={(e)=>{
            setMonth(e.target.value)
            console.log(e.target.value);
        }}
            className="month-picker-ceam"
            type="month"
            value={month}
            name=""
            id=""
        />
    </div>
    <div className="ceam-file-main">
      <button className='open-roster-download' onClick={()=>{
        setSelectMonth(true)
      }}>
      Download Roster Template
      </button>
      <button className='open-roster-upload' onClick={()=>{
        setOpenUpload(true)
      }}>
        Upload New Roster
      </button>
      <button className='open-roster-upload' onClick={()=>{
        setOpenUploadOT(true)
      }}>
        Upload OT Roster
      </button>
    </div>
   <div className='table-ceam'>
   <MUIDataTable
                    title="Shift Roster"  
                    data={rosterData}
                    columns={col}
                    options={options}
                ></MUIDataTable>
    <div className='ot-roster-table-main'>
               <MUIDataTable
                    title="Over Time Roster"  
                    data={rosterDataOT}
                    columns={col}
                    options={options}
                ></MUIDataTable>
    </div>
    
   </div>
   <ReactSpreadsheetImport isOpen={open} onClose={onClose} onSubmit={onSubmit} fields={fields} />
   <ReactSpreadsheetImport isOpen={openOT} onClose={onCloseOT} onSubmit={onSubmitOT} fields={fields} />
   <SlDialog label="Download Template" open={selectMonth} onSlRequestClose={() => setSelectMonth(false)}>
    
      <input
        onChange={(e)=>{
            setDownMonth(e.target.value)
            console.log(e.target.value);
            let arr = e.target.value.split("-");
            console.log(arr);
            getDays(arr[0], arr[1])
           
        }}
            className="month-picker-ceam"
            type="month"
            value={downMonth}
            name=""
            id=""
        />
        <SlButton slot="footer" variant="success" onClick={() =>{
          downloadTemplate()
        }}>
           <a href={href} download="template">Download Roster</a> 
        </SlButton>
        <SlButton slot="footer" variant="danger" onClick={() => setSelectMonth(false)}>
          Close
        </SlButton>
    </SlDialog>
    <SlDialog label="Upload Roster OT" open={openUploadOT} onSlAfterHide={() => setOpenUploadOT(false)}>
  
    <input
        onChange={(e)=>{
            setUploadDateData(e.target.value);
            let arr = e.target.value.split("-");
            setUploadMonth(arr[1])
            setUploadYear(arr[0])

            console.log(e.target.value);
        }}
            className="month-picker-ceam"
            type="month"
            value={uploadDateData}
            name=""
            id=""
        />
        <SlButton slot="footer" variant="success" onClick={() => {
          setOpenOT(true)
          setOpenUploadOT(false)
        }}>
          Next
        </SlButton>
        <SlButton slot="footer" variant="danger" onClick={() => setOpenUploadOT(false)}>
          Close
        </SlButton>
      </SlDialog>
    <SlDialog label="Upload Roster" open={openUpload} onSlAfterHide={() => setOpenUpload(false)}>
  
    <input
        onChange={(e)=>{
            setUploadDateData(e.target.value);
            let arr = e.target.value.split("-");
            setUploadMonth(arr[1])
            setUploadYear(arr[0])

            console.log(e.target.value);
        }}
            className="month-picker-ceam"
            type="month"
            value={uploadDateData}
            name=""
            id=""
        />
        <SlButton slot="footer" variant="success" onClick={() => {
          setOpen(true)
          setOpenUpload(false)
        }}>
          Next
        </SlButton>
        <SlButton slot="footer" variant="danger" onClick={() => setOpenUpload(false)}>
          Close
        </SlButton>
      </SlDialog>
</div>
   
  )
}

export default CeamRoster