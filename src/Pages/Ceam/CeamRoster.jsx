import React, { useState } from 'react'
import './Ceam.css';
import { SlButton, SlDialog,SlInput,SlMenuItem, SlSelect } from '@shoelace-style/shoelace/dist/react/index.js';
import thirtyonedays from './templates/31daysTemplate.xlsx'
import thirtydays from './templates/30daysTemplate.xlsx'
import twentyeightdays from './templates/28daysTemplate.xlsx'
import twentyninedays from './templates/9daysTemplate.xlsx'
import axios from 'axios'
import MUIDataTable from 'mui-datatables'
import * as xlsx from 'xlsx';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { baseurl } from '../../api/apiConfig';
import {  toast } from 'react-toastify';
function CeamRoster() {

  let navigate = useNavigate()
const [shiftList, setShiftList] = useState()
  const [open, setOpen] = useState(false)
  const [openOT, setOpenOT] = useState(false)
  const [file, setFile] = useState()
  const [rosterData, setRosterData] = useState()
  const [rosterDataOT, setRosterDataOT] = useState()
  const [uploadDateData, setUploadDateData] = useState('')
  const [uploadMonth, setUploadMonth] = useState('2022-10')
  const [uploadYear, setUploadYear] = useState()
  const [openUpload, setOpenUpload] = useState(false)
  const [openUploadOT, setOpenUploadOT] = useState(false)
  const [selectMonth, setSelectMonth] = useState(false)
  const [href, setHref] = useState()
  const [downMonth, setDownMonth] = useState('2022-02')
  const [col, setCol] = useState()
  const [division, setDivision] = useState()
  const [plantName, setPlantName] = useState()
  const [month, setMonth] =useState('2022-12')
  const [plantList, setPlantList] = useState([])
  const [divisionList, setDivisionList] = useState([])

  useEffect(()=>{
    getRoster()
   // getRosterOT()
  },[month])


  useEffect(()=>{
    getData()
   getShiftType()
   // getRosterOT()
  },[])
  const CustomToolbar = ({displayData}) => {
    return (
        <SlButton slot="footer" variant="primary">
            Update
          </SlButton>
    );
}
 function getShiftType(){
  axios({
    method: 'get',
    url: `${baseurl.base_url}/mhere/get-shift-type`,
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then((res)=>{
    console.log(res);
    setShiftList(res.data.data)

  })
  .catch((err)=>{
    console.log(err);
  })
 }

  const options = {
    tableBodyMaxHeight: '64vh',
    responsive: 'standard',
    selectableRowsHideCheckboxes: true,
    rowsPerPage:15
    //customToolbar: CustomToolbar ,
}

function getData() {
  axios({
    method: 'get',
    url: `${baseurl.base_url}/mhere/get-plant`,
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then((res)=>{
    console.log(res);
    setPlantList(res.data.data)
  })
  .catch((err)=>{
    console.log(err);
  })


}

function getDivision(item) {
  const data = {
    plant:item
  }
  axios({
    method: 'post',
    url: `${baseurl.base_url}/mhere/get-division`,
    headers: {
      'Content-Type': 'application/json',
    },
    data
  })
  .then((res)=>{
    console.log(res);
    setDivisionList(res.data.data)
  })
  .catch((err)=>{
    console.log(err);
  })
  
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
      url: `${baseurl.base_url}/mhere/get-roster`,
      headers: {
        'Content-Type': 'application/json',
      },
      data,
    })
    .then((res)=>{
      console.log(res.data.data);
      if(res.data.data.length){
        const columns = Object.keys(res.data.data[0]);
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
        setRosterData(res.data.data)
      }
      else{
        setRosterData()
      }
     
    })
    .catch((err)=>{
     // alert(err.response.data.message)
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
      url: `${baseurl.base_url}/mhere/get-ot-roster`,
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

  function onSubmit(){
   let arr = uploadDateData.split("-")
    console.log(arr);
    const data = {
      month:arr[1],
      year:arr[0],
      roster_data: file,
      employee_id:localStorage.getItem("employee_id"),
      manager_id:"57055",
      plant:plantName,
      "division":division
    }
    console.log(data);
    axios({
      method: 'post',
      url: `${baseurl.base_url}/mhere/upload-roster`,
      headers: {
        'Content-Type': 'application/json',
      },
      data,
    })
    .then((res)=>{
      console.log(res);
      toast.success(res.data.message);
    })
    .catch((err)=>{
    
      toast.error(err.response.data.message);
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
    <div className="ceam-roster-main">

    {/* <div className="ceam-roster-date-main">
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
    </div> */}
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
           getRoster()      
        }} >Get Roster</SlButton>
   </div>
       <div className='ceam-main-buttons'>
        {JSON.parse(localStorage.getItem('module_access'))?.roster_approval? <SlButton variant='neutral' onClick={()=>{
            navigate("/roster-approve")
        }} >Approve</SlButton>:""}
      
     {/*  <SlButton variant="primary" outline onClick={()=>{
          setSelectMonth(true)
        }}> Download Roster Template</SlButton> */}
      <SlButton variant="primary" outline onClick={()=>{
        setOpenUpload(true)
        }}> Upload New Roster</SlButton>
       </div>
    </div>
   <div className='table-ceam'>
  {rosterData? <MUIDataTable
      title="Shift Roster"  
      data={rosterData}
      columns={col}
      options={options}
  ></MUIDataTable>:<p className='no-data'>No Data Found For This Month</p>}
  
  {/*   <div className='ot-roster-table-main'>
               <MUIDataTable
                    title="Reward Roster"  
                    data={rosterDataOT}
                    columns={col}
                    options={options}
                ></MUIDataTable>
    </div> */}
    
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
        <p style={{"marginTop":"20px"}}>Allowed Values : 
        {shiftList?.map((item,i)=>{
           return(
            <span id={`${i}shift`} style={{"fontWeight":"bold"}}>{item.shift_character}, </span>
           )
        })}
        </p>
      
        <SlButton style={{"marginRight":"20px"}} slot="footer" variant="success" onClick={() =>{
          downloadTemplate()
        }}>
           <a href={href} download="template">Download Roster</a> 
        </SlButton>
        <SlButton slot="footer" variant="danger" onClick={() => setSelectMonth(false)}>
          Close
        </SlButton>
    </SlDialog>
    <SlDialog label="Upload Roster Reward" open={openUploadOT} onSlRequestClose={() => setOpenUploadOT(false)}>
  
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
          setOpenUploadOT(false)
        }}>
          Next
        </SlButton>
        <SlButton slot="footer" variant="danger" onClick={() => setOpenUploadOT(false)}>
          Close
        </SlButton>
      </SlDialog>
    <SlDialog label="Upload Roster" open={openUpload} onSlRequestClose={() => setOpenUpload(false)}>
    <SlInput
        onSlChange={(e)=>{
            setUploadDateData(e.target.value);
            console.log(e.target.value);
        }}
           style={{marginBottom:"20px"}}
           label="Select Month"
            type="Month"
            name=""
            id=""
        />
        <SlSelect style={{"marginBottom":"15px"}} label="Plant" onSlChange={(e)=>{
           setPlantName(e.target.value)
           getDivision(e.target.value)
        }}>
            {plantList?.map((item,i)=>{
            return(
              <SlMenuItem key={`${i}plant`} value={item.plant}>{item.plant}</SlMenuItem>

            )            
          })}
        </SlSelect> 
        <SlSelect style={{"marginBottom":"15px"}} label="Division" onSlChange={(e)=>{
           setDivision(e.target.value)
        }}>
            {divisionList?.map((item,i)=>{
            return(
              <SlMenuItem key={`${i}division`} value={item.division}>{item.division}</SlMenuItem>

            )            
          })}
        </SlSelect>
        <input  label='Upload File' type='file'  onChange={(e)=>{
            readUploadFile(e)
        }} />
        <SlButton slot="footer" style={{"marginRight":"20px"}} variant="success" onClick={() => {
          onSubmit()
          setOpenUpload(false)
        }}>
          Upload
        </SlButton>
        <SlButton slot="footer" variant="danger" onClick={() => setOpenUpload(false)}>
          Close
        </SlButton>
      </SlDialog>
</div>
   
  )
}

export default CeamRoster