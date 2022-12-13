import React, { useEffect, useState } from 'react'
import { SlButton, SlDialog,SlMenuItem, SlSelect,SlInput } from '@shoelace-style/shoelace/dist/react/index.js';
import axios from 'axios';
import * as xlsx from 'xlsx';
import { useNavigate } from 'react-router-dom';
import {  toast } from 'react-toastify';
import thirtyonedays from './templates/31daysTemplate.xlsx'
import thirtydays from './templates/30daysTemplate.xlsx'
import twentyeightdays from './templates/28daysTemplate.xlsx'
import twentyninedays from './templates/9daysTemplate.xlsx'
import MUIDataTable from 'mui-datatables'
import { baseurl } from '../../api/apiConfig';

function CeamOtRoster() {
  const [col, setCol] = useState()
  const [selectMonth, setSelectMonth] = useState(false)
  const [openUploadOT, setOpenUploadOT] = useState(false)
  const [uploadOtDate, setUploadOtDate] = useState('2022-12')
  const [file, setFile] = useState()
  const [downMonth, setDownMonth] = useState('2022-02')
  const [href, setHref] = useState()

  const [month, setMonth] = useState('2022-12')
  const [rosterDataOT, setRosterDataOT] = useState()
  const [division, setDivision] = useState()
  const [plantName, setPlantName] = useState()
  let navigate = useNavigate()

  useEffect(()=>{
   // getRoster()
    getRosterOT()
  },[month])
  const options = {
    tableBodyMaxHeight: '64vh',
    responsive: 'standard',
    selectableRowsHideCheckboxes: true,
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
    url: `${baseurl.base_url}/mhere/get-ot-roster`,
    headers: {
      'Content-Type': 'application/json',
    },
    data,
  })
  .then((res)=>{
    console.log(res.data.data);
  if(res.data.data.length){
    const columns = Object.keys(res.data.data[0])
    const statusIndex = columns.indexOf("status");
    const status = columns.splice(statusIndex, 1);
    columns.unshift(status[0])
    const plantIndex = columns.indexOf("plant");
        
    const plant = columns.splice(plantIndex, 1);
    columns.unshift(plant[0])
    const index = columns.indexOf("Employee Code");
    const empid = columns.splice(index, 1);
    columns.unshift(empid[0])
    setCol(columns)
    setRosterDataOT(res.data.data)
  }
  else{
    setRosterDataOT()
  }
  })
  .catch((err)=>{
    alert(err.response.data.message)
    console.log(err);
  })
}


  function onSubmitOT(){
    let arr = uploadOtDate.split("-")
    const uploadMonth = arr[1]
    const uploadYear = arr[0]
    const data = {
      month:uploadMonth,
      year:uploadYear,
      ot_roster_data: file,
      employee_id:localStorage.getItem("employee_id"),
      manager_id:"57055",
      plant:plantName,
      "division":division

    }
    console.log(data);
    axios({
      method: 'post',
      url: `${baseurl.base_url}/mhere/upload-ot-roster`,
      headers: {
        'Content-Type': 'application/json',
      },
      data,
    })
    .then((res)=>{
      console.log(res);
      toast.success(res.data.message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "colored",
        });
    })
    .catch((err)=>{
     // alert(err.response.data.message)
      toast.error(err.response.data.message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "colored",
        });
      console.log(err);
    })

  }


  const readUploadFile = (e) => {
    e.preventDefault()
    if (e.target.files) {
        const reader = new FileReader()
        reader.onload = (e) => {
            const data = e.target.result
            const workbook = xlsx.read(data, { type: 'array' })
            const sheetName = workbook.SheetNames[0]
            const worksheet = workbook.Sheets[sheetName]
            const json = xlsx.utils.sheet_to_json(worksheet)
            console.log(json)
            setFile(json)
        }
        reader.readAsArrayBuffer(e.target.files[0])
    }
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
    <div className='ceam-roster-main'>
  
        <div className="ceam-file-main">
          <div className='ceam-search-main'>
          <input
        onChange={(e)=>{
            setMonth(e.target.value)
            console.log(e.target.value);
        }}
            className="month-picker-ceam-second"
            type="month"
            value={month}
            name=""
            id=""
        />
          <SlButton  variant='primary' onClick={()=>{
           getRosterOT()      
        }} >Get Roster</SlButton>
          </div>
        <div className='ceam-main-buttons'>
          {JSON.parse(localStorage.getItem('module_access'))?.ot_approval? <SlButton variant='neutral' onClick={()=>{
            navigate("/ot-roster-approve")
        }} >Approve</SlButton>:""}
       
      <SlButton variant='primary' outline onClick={()=>{
        setSelectMonth(true)
      }}>
      Download Roster Template
      </SlButton>
      <SlButton variant='primary' outline  onClick={()=>{
       
       setOpenUploadOT(true)
      }}>
        Upload OT Roster
      </SlButton>
        </div>
     {/*  <SlButton variant='primary' onClick={()=>{
        navigate("/")
      }}>
        Go Attendence Roster
      </SlButton> */}
    </div>
    <SlDialog label="Upload Roster OT" open={openUploadOT} onSlAfterHide={() => setOpenUploadOT(false)}>
  
     <div className='file-input-dialog-main'>
     <input
      
      onChange={(e)=>{
        setUploadOtDate(e.target.value)
          console.log(e.target.value);
      }}
          className="month-picker-ceam ot-upload-month"
          type="month"
          value={uploadOtDate}
          name=""
          id=""
      />
      <SlInput style={{"marginBottom":"20px"}} onSlChange={(e)=>{
            setPlantName(e.target.value)
        }} label="Plant" />
        <SlInput style={{"marginBottom":"20px"}} onSlChange={(e)=>{
            setDivision(e.target.value)
        }} label="Divisiov" />
      <input className='custom-file-input' type="file" onChange={(e)=>{readUploadFile(e)}} />
     </div>
      <SlButton slot="footer" style={{"marginRight":"15px"}} variant="success" onClick={() => {
        onSubmitOT()
        setOpenUploadOT(false)

      }}>
        Upload
      </SlButton>
      <SlButton slot="footer" variant="danger" onClick={() => {
        setOpenUploadOT(false)
        
        }}>
        Close
      </SlButton>
    </SlDialog>
    <div className='table-ceam'>
    {rosterDataOT?<MUIDataTable
        title="Over Time Roster"  
        data={rosterDataOT}
        columns={col}
        options={options}
    ></MUIDataTable>:<p className='no-data'>No Data Found For This Month</p>}
    </div>
    <SlDialog label="Download Template" open={selectMonth} onSlRequestClose={() => setSelectMonth(false)}>
    
      <input
        onChange={(e)=>{
            setDownMonth(e.target.value)
            console.log(e.target.value);
            let arr = e.target.value.split("-");
            console.log(arr);
            getDays(arr[0], arr[1])
           
        }}
            className="month-picker-ceam-second"
            type="month"
            value={downMonth}
            name=""
            id=""
        />
        <p style={{"marginTop":"20px"}}>Allowed Values : OT1, OT2 , OT3, OT4</p>
        <SlButton style={{"marginRight":"20px"}} slot="footer" variant="success">
           <a href={href} download="template">Download Roster</a> 
        </SlButton>
        <SlButton slot="footer" variant="danger" onClick={() => setSelectMonth(false)}>
          Close
        </SlButton>
    </SlDialog>
    </div>
  )
}

export default CeamOtRoster