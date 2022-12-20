import { SlButton, SlDialog, SlInput, SlMenuItem, SlSelect, SlTag } from '@shoelace-style/shoelace/dist/react/index'
import axios from 'axios'
import MUIDataTable from 'mui-datatables'
import React, { useState } from 'react'
import { useEffect } from 'react'
import './EmployeeMaster.css'
import * as xlsx from 'xlsx';
import { baseurl } from '../../api/apiConfig'
import { toast } from 'react-toastify'


function EmployeeMaster() {
  const [vendorList, setVendorList] = useState()
  const [divisionList, setDivisionList] = useState([])

    const [plantList, setPlantList] = useState()
    const [deptList, setDeptList] = useState()
    const [categoryList, setCategoryList] = useState()
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
      category:"",
      division:"",
      mobile_number: "",
      DOJ: "",
      father_name:"",
      department:"",
      DOB:"",
      uan_number:"",
      esic_number:"",
      bank_account_number:"",
      ifsc_code:"",
      address:"",
      uploaded_by: localStorage.getItem("employee_id")
  })
    const [newEmpData, setNewEmpData] = useState({
        
    })

    /* Dialog States */
    const [openAddEmp, setOpenAddEmp] = useState(false)
    useEffect(()=>{
        getEmployees()
        getCategory()
        getDeptList()
        getData()
        getVendorlist()
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
        rowsPerPage:15,
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
          //  console.log(res);
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
        toast.success(res.data.message);
          getEmployees()
      })
      .catch((err)=>{
        console.log(err);
        toast.error(err.response.data.message);
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
        //console.log(res);
        toast.success(res.data.message)
      })
      .catch((err)=>{
        console.log(err);
      })
    }
    function getCategory(){
      axios({
        method: 'get',
        url: `${baseurl.base_url}/mhere/get-ceam-category-master`,
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res)=>{
      //  console.log(res.data.data);
        setCategoryList(res.data.data)
       // toast.success(res.data.message)
      })
      .catch((err)=>{
        console.log(err);
      })
    }
    function getDeptList(){
      axios({
        method: 'get',
        url: `${baseurl.base_url}/mhere/get-ceam-department-master`,
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res)=>{
      //  console.log(res.data.data);
        setDeptList(res.data.data)
       // toast.success(res.data.message)
      })
      .catch((err)=>{
        console.log(err);
      })
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
      //  console.log(res.data.data);
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
      //  console.log(res);
        setDivisionList(res.data.data)
      })
      .catch((err)=>{
        console.log(err);
      })      
  }
  function getVendorlist(){
    axios({
        method: 'get',
        url: `${baseurl.base_url}/mhere/get-ceam-vendor-master`,
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res)=>{
       // console.log(res);
        setVendorList(res.data.data)
       
      })
      .catch((err)=>{
        console.log(err);
      })
}


  return (
    <div className='employee-master-main'>
         <div className="employee-master-buttons-main">
           <div className='ceam-search-main' style={{"display":"flex","alignItems":"center"}}>
            <input type="file" className='file-input-employee-master' onChange={(e)=>{
              console.log(e.target.files[0]);
              readUploadFile(e)
          //    setBulkUploadFile(e.target.files[0])
            }} />
           <SlButton className="plant-add-button" variant="primary"  onClick={()=>{
            sendEmployeeBulk()
                //setAddPlantDialog(true)
            }}>Bulk Upload</SlButton>
           </div>
            <div className='ceam-main-buttons' style={{"display":"flex","gap":"25px", "flexWrap":"wrap"}}>
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
        <SlDialog style={{ '--width': '80vw' }} label="Add Employee" open={openAddEmp} onSlRequestClose={() => setOpenAddEmp(false)}>
            <div className='add-emp-inputs-main'>
            <SlInput className='add-emp-input' placeholder='eg : EMP001' label="Employee ID" onSlChange={(e)=>{setSingleEmployeeUpload({...singleEmployeeUpload,employee_id:e.target.value})}} />
            <SlInput className='add-emp-input' placeholder='eg : Akash' label="Employee Name (As per Aadhar) " onSlChange={(e)=>{setSingleEmployeeUpload({...singleEmployeeUpload,employee_name:e.target.value})}}  />
           
           {/*  <SlInput className='add-emp-input' placeholder='eg : VEN001' label="Vendor Code" onSlChange={(e)=>{setSingleEmployeeUpload({...singleEmployeeUpload,vendor_name:e.target.value})}} /> */}
            <SlSelect className='add-emp-input' label="Select Vendor Code" onSlChange={(e)=>{
              setSingleEmployeeUpload({...singleEmployeeUpload,vendor_name:JSON.parse(e.target.value).vendor_name,vendor_code:JSON.parse(e.target.value).vendor_code})
            }}>
              {
                vendorList?.map((item,i)=>{
             return(
              <SlMenuItem key={`${i}ven`} value={JSON.stringify(item)}>{item.vendor_code}</SlMenuItem>
             )

                })
              }
            </SlSelect>
            <SlInput className='add-emp-input' disabled  label="Vendor Name" value={singleEmployeeUpload.vendor_name} />
       {/*      <SlInput className='add-emp-input' placeholder='eg : Dept' label="Department" onSlChange={(e)=>{setSingleEmployeeUpload({...singleEmployeeUpload,department:e.target.value})}} /> */}
            <SlSelect className='add-emp-input' label="Select Department" onSlChange={(e)=>{setSingleEmployeeUpload({...singleEmployeeUpload,department:e.target.value})}}>
              {
                deptList?.map((item,i)=>{
             return(
              <SlMenuItem key={`${i}dept`} value={item.department}>{item.department}</SlMenuItem>
             )

                })
              }
            </SlSelect>
          {/*   <SlInput className='add-emp-input' label="Gender" onSlChange={(e)=>{setSingleEmployeeUpload({...singleEmployeeUpload,gender:e.target.value})}} /> */}
            <SlSelect className='add-emp-input' label="Select Gender" onSlChange={(e)=>{setSingleEmployeeUpload({...singleEmployeeUpload,gender:e.target.value})}}>
              <SlMenuItem value="M">Male</SlMenuItem>
              <SlMenuItem value="F">Female</SlMenuItem>
            </SlSelect>
            <SlSelect className='add-emp-input' label="Select Category" onSlChange={(e)=>{setSingleEmployeeUpload({...singleEmployeeUpload,category:e.target.value})}}>
            {
                categoryList?.map((item,i)=>{
             return(
              <SlMenuItem key={`${i}cat`} value={item.category}>{item.category}</SlMenuItem>
             )})}
            </SlSelect>
            <SlInput className='add-emp-input' label="Father Name" onSlChange={(e)=>{setSingleEmployeeUpload({...singleEmployeeUpload,father_name:e.target.value})}} />
            <SlInput className='add-emp-input' placeholder='eg : H54 - microtek' label="Address" onSlChange={(e)=>{setSingleEmployeeUpload({...singleEmployeeUpload,address:e.target.value})}} />
{/*             <SlInput className='add-emp-input' label="Base Location (Plant)" onSlChange={(e)=>{setSingleEmployeeUpload({...singleEmployeeUpload,base_location:e.target.value})}} /> */}
            <SlSelect className='add-emp-input' label="Select Plant" onSlChange={(e)=>{ getDivision(e.target.value);setSingleEmployeeUpload({...singleEmployeeUpload,base_location:e.target.value})}}>
            {
                plantList?.map((item,i)=>{
             return(
              <SlMenuItem key={`${i}plant`} value={item.plant}>{item.plant}</SlMenuItem>
             )})}
            </SlSelect>
            <SlSelect className='add-emp-input' label="Select Division" onSlChange={(e)=>{setSingleEmployeeUpload({...singleEmployeeUpload,division:e.target.value})}}>
            {divisionList?.map((item,i)=>{
            return(
              <SlMenuItem key={`${i}divisionu`} value={item.division}>{item.division}</SlMenuItem>

            )            
            })}
            </SlSelect>
       
            <SlInput className='add-emp-input' label="Aadhar Number" onSlChange={(e)=>{setSingleEmployeeUpload({...singleEmployeeUpload,aadhar_card_number:e.target.value})}} />
            <SlInput className='add-emp-input' label="UAN Number" onSlChange={(e)=>{setSingleEmployeeUpload({...singleEmployeeUpload,uan_number:e.target.value})}} />
            <SlInput className='add-emp-input' label="ESIC Number" onSlChange={(e)=>{setSingleEmployeeUpload({...singleEmployeeUpload,esic_number:e.target.value})}} />
            <SlInput className='add-emp-input' label="Bank Account Number" onSlChange={(e)=>{setSingleEmployeeUpload({...singleEmployeeUpload,bank_account_number:e.target.value})}} />
            <SlInput className='add-emp-input' label="IFSC Code" onSlChange={(e)=>{setSingleEmployeeUpload({...singleEmployeeUpload,ifsc_code:e.target.value})}} />
            <SlInput className='add-emp-input' noSpinButtons  type='number' label="Mobile Number" onSlChange={(e)=>{setSingleEmployeeUpload({...singleEmployeeUpload,mobile_number:e.target.value})}} />
            <SlInput className='add-emp-input' type='date' label="Date Of Birth" onSlChange={(e)=>{setSingleEmployeeUpload({...singleEmployeeUpload,DOB:e.target.value})}} />
            <SlInput className='add-emp-input' type='date' label="Date Of Joining" onSlChange={(e)=>{setSingleEmployeeUpload({...singleEmployeeUpload,DOJ:e.target.value})}} />
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