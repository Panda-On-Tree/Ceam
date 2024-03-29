import { SlButton, SlDialog, SlIcon, SlInput, SlMenuItem, SlSelect, SlTag } from '@shoelace-style/shoelace/dist/react/index'
import axios from 'axios'
import MUIDataTable from 'mui-datatables'
import React, { useState } from 'react'
import { useEffect } from 'react'
import './EmployeeMaster.css'
import * as xlsx from 'xlsx';
import { baseurl } from '../../api/apiConfig'
import { toast } from 'react-toastify'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

function EmployeeMaster() {

    /* Backdrop state */
    const [openBackdrop, setOpenBackdrop] = useState(false)
    /* Backdrop state */
    
    const [authVerificationData, setAuthVerificationData] = useState()
    const [empAadharName, setEmpAadharName] = useState()
    const [empAadharCode, setEmpAadharCode] = useState()
    const [token, setToken] = useState()
    const [aadharOtp, setAadharOtp] = useState()

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

    const [deactivateId, setDeactivateId] = useState("")

    const [empUpdateData, setEmpUpdateData] = useState({
      location:"",
      division:""
    })


    /* Dialog States */
    const [openAddEmp, setOpenAddEmp] = useState(false)
    const [openUpdateEmp, setOpenUpdateEmp] = useState(false)
    const [openAadharDialog, setOpenAadharDialog] = useState(false)
    const [openDeactivate, setOpenDeactivate] = useState(false)
    useEffect(()=>{
        getEmployees()
        getCategory()
        getDeptList()
        getData()
        getVendorlist()
    },[])


    function sendAadharOtp(aad_number){
      const data ={ 
          "username":"test",
          "password":"test@123"
      }
      axios({
        method: 'post',
        url: `${baseurl.base_url}/verification/auth`,
        headers: {
          'Content-Type': 'application/json',
        },
        data
      })
      .then((res)=>{
        console.log(res);
        setToken(res.data.data.token)
        axios({
          method:"post",
          url:`${baseurl.base_url}/verification/aadhar-okyc`,
          headers:{
            "Content-Type": "application/json",
            "Authorization": `Bearer ${res.data.data.token}`
          },
          data : {
            aadhar_number:aad_number
          }
        })
        .then((res)=>{
          console.log(res);
          setOpenBackdrop(false)
          toast.success(res.data.message)
          setAuthVerificationData(res.data.data)
        })
        .catch((err)=>{
          console.log(err);
          setOpenBackdrop(false)

          toast.success("An error Occures")
        })
      })
      .catch((err)=>{
        setOpenBackdrop(false)

        console.log(err);
      })

    }

    function sendOtpToVerify(){
      const data ={
        "otp":aadharOtp,
        "ref_id":authVerificationData.ref_id,
        "name_on_aadhar":empAadharName
    }
    console.log(data);
      axios({
        method:"post",
        url:`${baseurl.base_url}/verification/aadhar-otp`,
        headers:{
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        data
      })
      .then((res)=>{
        
        toast.success(res.data.message);
        setOpenAadharDialog(false)
        if(res.data.data.status === "VALID"){
          console.log("valid");
          const data ={
            employee_id:empAadharCode
          }
          axios({
            method:"post",
            url:`${baseurl.base_url}/mhere/verify-ceam-employee-aadhar`,
            headers:{
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            data
          })
          .then((res)=>{
            console.log(res);
          setOpenBackdrop(false)

            getEmployees()
          })
          .catch((err)=>{
          setOpenBackdrop(false)

            console.log(err);
          })
        }

      })
      .catch((err)=>{
        setOpenBackdrop(false)

        console.log(err);
        toast.error(err.response.data.data.message)
      })
      
    }
    
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
            name: "division",
            label:"Division",
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
          name: "active_flag",
          label:"Active",
          options: {
           filter: true,
           sort: false,
           customBodyRenderLite: (dataIndex, rowIndex) => {

            //console.log(dataIndex);
            return(
              <div>
                {empData[dataIndex].active_flag?"true":"false"}
              </div>
            )
        }
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
                   <div className="edit-button-main">
                    {!empData[dataIndex].aadhar_verify_flag?<SlTag variant='warning' size="small" className="tag-row" onClick={e => {
                      setOpenAadharDialog(true)
                      setOpenBackdrop(true)
                      sendAadharOtp(empData[dataIndex].aadhar_card_number)
                      setEmpAadharName(empData[dataIndex].employee_name)
                      setEmpAadharCode((empData[dataIndex].employee_id))
                      
                    }} >
                        Verify
                    </SlTag>:<SlTag variant='success' size="small" className="tag-row" onClick={e => {
                    }} style={{"cursor":"not-allowed","pointerEvents":"none" }}>
                        Verified
                    </SlTag>}
                    
                   
                   </div>
                );
            }

            }
        },
        {
          name: "deactivate",
          label:"Actions",
          options: {
           filter: true,
           sort: false,
           customBodyRenderLite: (dataIndex, rowIndex) => {
              return (
                 <div className="edit-button-main" style={{gap:'15px'}}>
                 <SlTag variant='danger' size="small" className="tag-row" onClick={() => {
                    setDeactivateId(empData[dataIndex].employee_id);
                    setOpenDeactivate(true)
                  }}>
                     <SlIcon name='trash'></SlIcon>
                    
                  </SlTag>
                  <SlTag variant='success' size="small" className="tag-row" onClick={() => {
                   setDeactivateId(empData[dataIndex].employee_id);

                    setOpenUpdateEmp(true)
                  }}>
                    <SlIcon name='pencil-square'></SlIcon>
                    
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
           // console.log(res);
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
        setSingleEmployeeUpload({
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


function sendDeactivate(){
  console.log("hello");
  axios({
    method: 'post',
    url: `${baseurl.base_url}/mhere/delete-ceam-employee-master`,
    headers: {
      'Content-Type': 'application/json',
    },
    data:{
      employee_id:deactivateId
    }
  })
  .then((res)=>{
    console.log(res);
    toast.success(res.data.message) 
    setOpenDeactivate(false);
    getEmployees()
  })
  .catch((err)=>{
    console.log(err);
  })
}

  function sendEmployeeUpdate(){
    const data = empUpdateData
    data.employee_id = deactivateId
    console.log(data);
    axios({
      method: 'post',
      url: `${baseurl.base_url}/mhere/update-ceam-employee-master`,
      headers: {
        'Content-Type': 'application/json',
      },
     data
    })
    .then((res)=>{
      console.log(res);
      toast.success(res.data.message) 
      getEmployees()
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
            }}>Bulk Upload Employee</SlButton>
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
      <SlDialog label="Dialog" open={openAadharDialog} onSlRequestClose={() => setOpenAadharDialog(false)}>
        <SlInput noSpinButtons className='aadhar-otp-input' type='number' label='Enter OTP' onSlChange={(e)=>{
            setAadharOtp(e.target.value)
        }}></SlInput>
        <SlButton style={{"marginRight":"20px"}} slot="footer" variant="success" outline onClick={() => {
          sendOtpToVerify()
          setOpenBackdrop(true)

        }}>
          Submit
        </SlButton>
        <SlButton slot="footer" variant="primary" onClick={() => setOpenAadharDialog(false)}>
          Close
        </SlButton>
      </SlDialog>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackdrop}
        onClick={()=>{setOpenBackdrop(false)}}

      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <SlDialog label="Deactivate" open={openDeactivate} onSlRequestClose={() => setOpenDeactivate(false)}>
         Deactivate Employee - {deactivateId}
        <SlButton slot="footer" variant="warning" style={{marginRight:'30px'}} onClick={sendDeactivate}>
          Deactiavte
        </SlButton>
        <SlButton slot="footer" variant="primary" onClick={() => setOpenDeactivate(false)}>
          Cancel
        </SlButton>
      </SlDialog>
      <SlDialog label="Update" open={openUpdateEmp} onSlRequestClose={() => setOpenUpdateEmp(false)}>
     <div style={{display:'flex', flexDirection:'column', gap:'20px'}}>
     <SlSelect className='add-emp-input' label="Select Location" onSlChange={(e)=>{ getDivision(e.target.value);setEmpUpdateData({...empUpdateData, location:e.target.value})}}>
            {
                plantList?.map((item,i)=>{
             return(
              <SlMenuItem key={`${i}plant`} value={item.plant}>{item.plant}</SlMenuItem>
             )})}
            </SlSelect>
            <SlSelect className='add-emp-input' label="Select Division" onSlChange={(e)=>{setEmpUpdateData({...empUpdateData, division:e.target.value})}}>
            {divisionList?.map((item,i)=>{
            return(
              <SlMenuItem key={`${i}divisionu`} value={item.division}>{item.division}</SlMenuItem>

            )            
            })}
            </SlSelect>
     </div>
        <SlButton slot="footer" variant="success" style={{"marginRight":"20px"}}  onClick={sendEmployeeUpdate}>
          Update
        </SlButton>
        <SlButton slot="footer" variant="primary" onClick={() => setOpenUpdateEmp(false)}>
          Close
        </SlButton>
      </SlDialog>
    </div>
  )
}

export default EmployeeMaster