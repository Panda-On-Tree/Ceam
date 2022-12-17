import { SlButton, SlDialog, SlInput, SlTag } from '@shoelace-style/shoelace/dist/react/index'
import axios from 'axios'
import MUIDataTable from 'mui-datatables'
import React, { useState } from 'react'
import { useEffect } from 'react'
import './EmployeeMaster.css'
import * as xlsx from 'xlsx';
import { baseurl } from '../../api/apiConfig'
import { toast } from 'react-toastify'


function EmployeeMaster() {

  
    /* get api states */
    const [empData, setEmpData] = useState()
    const [col, setCol] = useState()
  
    /* update /add states */
    const [bulkUploadFile, setBulkUploadFile] = useState()
    const [singleEmployeeUpload, setSingleEmployeeUpload] = useState({
      employee_id: "",
      employee_name: "",
      vendor_code: "",
      vendor_name: "",
      gender: "",
      base_location: "",
      aadhar_card_number: "",
      mobile_number: "",
      DOJ: "",
      uploaded_by: localStorage.getItem("employee_id")
  })
    const [newEmpData, setNewEmpData] = useState({
        
    })

    /* Dialog States */
    const [openAddEmp, setOpenAddEmp] = useState(false)
    useEffect(()=>{
        getEmployees()
    },[])

    
    const column =[
        {
            name: "employee_id",
            label:"Employee ID",
            options: {
             filter: true,
             sort: false
            }
        },
        {
            name: "employee_name",
            label:"Employee Name",
            options: {
             filter: true,
             sort: false
            }
        },
        {
            name: "vendor_code",
            label:"Vendor Code",
            options: {
             filter: true,
             sort: false
            }
        },
        {
            name: "vendor_name",
            label:"Vendor Name",
            options: {
             filter: true,
             sort: false
            }
        },
        {
            name: "gender",
            label:"Gender",
            options: {
             filter: true,
             sort: false
            }
        },
        {
            name: "base_location",
            label:"Location",
            options: {
             filter: true,
             sort: false
            }
        },
        {
            name: "aadhar_card_number",
            label:"Aadhar Card Number",
            options: {
             filter: true,
             sort: false
            }
        },
        {
            name: "mobile_number",
            label:"Mobile Number",
            options: {
             filter: true,
             sort: false
            }
        },
        {
            name: "DOJ",
            label:"DOJ",
            options: {
             filter: true,
             sort: false
            }
        },
        {
            name: "frt_verify_flag",
            label:"FRT Verified",
            options: {
             filter: true,
             sort: false,
             customBodyRenderLite: (dataIndex, rowIndex) => {

              //console.log(dataIndex);
              return(
                <div>
                  {empData[dataIndex].frt_verify_flag?"true":"false"}
                </div>
              )
          }
            }
        },
        {
            name: "verify_aadhar",
            label:"Verify Aadhar",
            options: {
             filter: true,
             sort: false,
             customBodyRenderLite: (dataIndex, rowIndex) => {
                return (
                   <div className="edit-button-main" style={{"cursor":"not-allowed"}}>
                    <SlTag variant='warning' size="small" className="tag-row" onClick={e => {
                    }} style={{"cursor":"not-allowed","pointerEvents":"none" }}>
                        Verify
                    </SlTag>
                   </div>
                );
            }

            }
        },
        
    ]
    
    const options = {
        tableBodyMaxHeight: '64vh',
        responsive: 'standard',
        selectableRowsHideCheckboxes: true,
        sort:false,
        customBodyRender:()=>{

        }

        //customToolbar: CustomToolbar ,
    }

    function getEmployees(){
        axios({
            method: 'get',
            url: `${baseurl.base_url}/mhere/get-ceam-employee-master`,
            headers: {
              'Content-Type': 'application/json',
            },
          })
          .then((res)=>{
            console.log(res);
            setEmpData(res.data.data)
            if(res.data.data.length){
              let myArray = Object.keys(res.data.data[0])
              let idIndex = myArray.indexOf("ceam_master_id");
              myArray.splice(idIndex, 1);
               setCol(myArray)

            }
          
          })
          .catch((err)=>{
            console.log(err);
          })
    }

    function sendEmployeeBulk(){
      
      const data  = {
        employee_data:bulkUploadFile,
        uploaded_by: localStorage.getItem("employee_id")
      }
      console.log(data);
      axios({
        method: 'post',
        url: `${baseurl.base_url}/mhere/upload-bulk-ceam-employee-master`,
        headers: {
          'Content-Type': 'application/json',
        },
        data
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
          getEmployees()
      })
      .catch((err)=>{
        console.log(err);
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
      })
    }
    function sendEmployeeSignle(){
      
     
      //console.log(data);
      axios({
        method: 'post',
        url: `${baseurl.base_url}/mhere/upload-single-ceam-employee-master`,
        headers: {
          'Content-Type': 'application/json',
        },
        data:singleEmployeeUpload
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
          getEmployees()
      })
      .catch((err)=>{
        console.log(err);
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
              setBulkUploadFile(json)
             // setFile(json)
          }
          reader.readAsArrayBuffer(e.target.files[0])
      }
    }

    function sendsyncfrt(){
      axios({
        method: 'get',
        url: `${baseurl.base_url}/mhere/sync-frt-data`,
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res)=>{
        console.log(res);
      })
      .catch((err)=>{
        console.log(err);
      })
    }

  return (
    <div className='employee-master-main'>
         <div className="employee-master-buttons-main">
           <div style={{"display":"flex","alignItems":"center"}}>
            <input type="file" className='custom-file-input' onChange={(e)=>{
              console.log(e.target.files[0]);
              readUploadFile(e)
          //    setBulkUploadFile(e.target.files[0])
            }} />
           <SlButton className="plant-add-button" variant="primary"  onClick={()=>{
            sendEmployeeBulk()
                //setAddPlantDialog(true)
            }}>Bulk Upload</SlButton>
           </div>
            <div style={{"display":"flex","gap":"25px"}} className=''>
            <SlButton className="plant-add-button" variant="warning"  onClick={()=>{
                sendsyncfrt()
            }}>Sync FRT</SlButton>
            <SlButton className="plant-add-button" variant="primary"  onClick={()=>{
                
                setOpenAddEmp(true)
            }}>Single Employee Upload</SlButton>
            </div>
          
        </div>
        <div style={{"marginTop":"5vh"}} className='table-ceam'>
        <MUIDataTable
        title="Employee Data"
        data={empData}
        columns={column}
        options={options}
      ></MUIDataTable>
        </div>
        <SlDialog label="Add Employee" open={openAddEmp} onSlRequestClose={() => setOpenAddEmp(false)}>
            <div className='add-emp-inputs-main'>
            <SlInput label="Employee ID" onSlChange={(e)=>{setSingleEmployeeUpload({...singleEmployeeUpload,employee_id:e.target.value})}} />
            <SlInput label="Employee Name" onSlChange={(e)=>{setSingleEmployeeUpload({...singleEmployeeUpload,employee_name:e.target.value})}}  />
            <SlInput label="Vendor Code" onSlChange={(e)=>{setSingleEmployeeUpload({...singleEmployeeUpload,vendor_name:e.target.value})}} />
            <SlInput label="Vendor Name" onSlChange={(e)=>{setSingleEmployeeUpload({...singleEmployeeUpload,vendor_code:e.target.value})}} />
            <SlInput label="Gender" onSlChange={(e)=>{setSingleEmployeeUpload({...singleEmployeeUpload,gender:e.target.value})}} />
            <SlInput label="Base Location" onSlChange={(e)=>{setSingleEmployeeUpload({...singleEmployeeUpload,base_location:e.target.value})}} />
            <SlInput label="Aadhar Number" onSlChange={(e)=>{setSingleEmployeeUpload({...singleEmployeeUpload,aadhar_card_number:e.target.value})}} />
            <SlInput noSpinButtons  type='number' label="Mobile Number" onSlChange={(e)=>{setSingleEmployeeUpload({...singleEmployeeUpload,mobile_number:e.target.value})}} />
            <SlInput style={{"minWidth":"47%"}} type='date' label="Date Of Joining" onSlChange={(e)=>{setSingleEmployeeUpload({...singleEmployeeUpload,DOJ:e.target.value})}} />
            </div>
            <div className='add-emp-buttons-main'>
            <SlButton slot="footer" variant="success" outline onClick={() => {
              sendEmployeeSignle()
              setOpenAddEmp(false)}}>
          Add Employee
        </SlButton>
        <SlButton slot="footer" variant="danger" outline onClick={() => setOpenAddEmp(false)}>
          Close
        </SlButton>
            </div>
      </SlDialog>

    </div>
  )
}

export default EmployeeMaster