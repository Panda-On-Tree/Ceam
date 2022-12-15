import { SlButton, SlDialog, SlInput, SlTag } from '@shoelace-style/shoelace/dist/react/index'
import axios from 'axios'
import MUIDataTable from 'mui-datatables'
import React, { useState } from 'react'
import { useEffect } from 'react'
import './EmployeeMaster.css'


function EmployeeMaster() {


    /* get api states */
    const [empData, setEmpData] = useState()
    const [col, setCol] = useState()
  
    /* update /add states */

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
            url: `http://192.168.137.234:8080/v1/api/mhere/get-ceam-employee-master`,
            headers: {
              'Content-Type': 'application/json',
            },
          })
          .then((res)=>{
            console.log(res);
            setEmpData(res.data.data)
            
            let myArray = Object.keys(res.data.data[0])
            let idIndex = myArray.indexOf("ceam_master_id");
            myArray.splice(idIndex, 1);
            setCol(myArray)
          })
          .catch((err)=>{
            console.log(err);
          })
    }

  return (
    <div className='employee-master-main'>
         <div className="employee-master-buttons-main">
           <div>
           <SlButton className="plant-add-button" variant="primary"  onClick={()=>{
                //setAddPlantDialog(true)
            }}>Bulk Upload</SlButton>
           </div>
            <div>
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
            <SlInput label="Employee Name" />
            <SlInput label="Vendor Code" />
            <SlInput label="Vendor Name" />
            <SlInput label="Gender" />
            <SlInput label="Base Location" />
            <SlInput label="Aadhar Number" />
            <SlInput noSpinButtons  type='number' label="Mobile Number" />
            <SlInput label="Date Of Joining" />
                       </div>
            <div className='add-emp-buttons-main'>
            <SlButton slot="footer" variant="success" outline onClick={() => setOpenAddEmp(false)}>
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