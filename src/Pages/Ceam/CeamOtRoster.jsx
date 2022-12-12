import React, { useEffect, useState } from 'react'
import { SlButton, SlDialog,SlMenuItem, SlSelect,SlInput } from '@shoelace-style/shoelace/dist/react/index.js';
import axios from 'axios';
import * as xlsx from 'xlsx';
import { useNavigate } from 'react-router-dom';
import {  toast } from 'react-toastify';

import MUIDataTable from 'mui-datatables'
import { baseurl } from '../../api/apiConfig';

function CeamOtRoster() {
  const [col, setCol] = useState()

  const [openUploadOT, setOpenUploadOT] = useState(false)
  const [uploadOtDate, setUploadOtDate] = useState('2022-12')
  const [file, setFile] = useState()
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
          <SlButton variant='primary' onClick={()=>{
           getRosterOT()      
        }} >Get Roster</SlButton>
          </div>
        <div className='ceam-main-buttons'>
        <SlButton variant='neutral' onClick={()=>{
            navigate("/ot-roster-approve")
        }} >Approve</SlButton>
      <SlButton variant='primary' onClick={()=>{
       // setSelectMonth(true)
      }}>
      Download Roster Template
      </SlButton>
      <SlButton variant='primary'  onClick={()=>{
       
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
    
    </div>
  )
}

export default CeamOtRoster