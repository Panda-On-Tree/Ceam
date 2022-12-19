import { SlButton, SlDetails, SlInput } from '@shoelace-style/shoelace/dist/react/index'
import './ViewAttendance.css'
import React, { useState } from 'react'
import MUIDataTable from 'mui-datatables'
import axios from 'axios';
import { baseurl } from '../../api/apiConfig';

function ViewAttendance() {


    const [sendEmployeeData, setSendEmployeeData] = useState({
        start_date:"",
        end_date:"",
        employee_id:""
    })
    const [employeeData, setEmployeeData] = useState()

    const [sendVendorData, setSendVendorData] = useState({
        start_date:"",
        end_date:"",
        vendor_code:""
    })
    const [vendorData, setVendorData] = useState()
    const [sendPlantData, setSendPlantData] = useState({
        start_date:"",
        end_date:"",
        plant_name:""
    })
    const [plantData, setPlantData] = useState()

    const tableData =[];
    const column =[];
    const EmployeeColumn =[
        {
            name: "employee_id",
            label:"Employee Code",
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
            name: "vendor_name",
            label:"Vendor Name",
            options: {
             filter: true,
             sort: false
            }
        },
        {
            name: "attendance_date",
            label:"Date",
            options: {
             filter: true,
             sort: false
            }
        },
        {
            name: "attendance_shift",
            label:"Shift",
            options: {
             filter: true,
             sort: false
            }
        },
        {
            name: "InTime",
            label:"In Time",
            options: {
             filter: true,
             sort: false
            }
        },
        {
            name: "OutTime",
            label:"Out Time",
            options: {
             filter: true,
             sort: false
            }
        },
        {
            name: "attendance",
            label:"Attendance",
            options: {
             filter: true,
             sort: false
            }
        },
        {
            name: "employee_working_minutes",
            label:"Minutes Worked",
            options: {
             filter: true,
             sort: false
            }
        },
        {
            name: "considered_ot_attendance",
            label:"OT Attendance",
            options: {
             filter: true,
             sort: false
            }
        },
    ];
    const options = {
        tableBodyMaxHeight: '64vh',
        responsive: 'standard',
        selectableRowsHideCheckboxes: true,
        sort:false,
    }

    function getAttendanceByEmployee(){

        axios({
            method: 'post',
            url: `${baseurl.base_url}/mhere/get-attendance-by-employee-id`,
            headers: {
              'Content-Type': 'application/json',
            },
            data:sendEmployeeData
          })
          .then((res)=>{
            console.log(res.data.data);
            
            let data = res.data.data;
            data.forEach((item) => {
                item.InTime=item.InTime.split("T")[1]
                item.OutTime=item.OutTime.split("T")[1]
                item.employee_working_minutes = `${parseInt(item.employee_working_minutes/60)}H ${item.employee_working_minutes - (parseInt(item.employee_working_minutes/60)*60)}M`
  
            });
            setEmployeeData(data);
          })
          .catch((err)=>{
            console.log(err);
          })      
    }

    function getAttendanceByVendor(){

    

        axios({
            method: 'post',
            url: `${baseurl.base_url}/mhere/get-attendance-by-vendor-id`,
            headers: {
              'Content-Type': 'application/json',
            },
            data:sendVendorData
          })
          .then((res)=>{
            console.log(res.data.data);
            setVendorData(res.data.data)
          })
          .catch((err)=>{
            console.log(err);
          })      
    }
    function getAttendanceByPlantName(){

      

        axios({
            method: 'post',
            url: `${baseurl.base_url}/mhere/get-attendance-by-plant-name`,
            headers: {
              'Content-Type': 'application/json',
            },
            data:sendPlantData
          })
          .then((res)=>{
            console.log(res.data.data);
            setPlantData(res.data.data);
          })
          .catch((err)=>{
            console.log(err);
          })      
    }


  return (
    <div className='view-attendance-main'>
        <SlDetails className='sl-details' open summary="Search By Employee Id">
            <div className='attendance-search-main'>
                <div className='attendance-search-input-main'>
                    <SlInput label='Employee Code' onSlChange={(e)=> setSendEmployeeData({...sendEmployeeData,employee_id:e.target.value})}></SlInput>
                    <SlInput type='date' label='Start Date' onSlChange={(e)=> setSendEmployeeData({...sendEmployeeData,start_date:e.target.value})}></SlInput>
                    <SlInput type='date' label='End Date' onSlChange={(e)=> setSendEmployeeData({...sendEmployeeData,end_date:e.target.value})}></SlInput>
                    <SlButton variant='primary' onClick={()=>{
                        getAttendanceByEmployee()
                    }}>Search</SlButton>
                </div>
                <div style={{"marginTop":"5vh"}} className='table-ceam'>
                <MUIDataTable
                        title="Attendance Data"
                        data={employeeData}
                        columns={EmployeeColumn}
                        options={options}>

                </MUIDataTable>
                </div>
            </div>
        </SlDetails>
        <SlDetails className='sl-details' summary="Search By Vendor">
        <div className='attendance-search-main'>
                <div className='attendance-search-input-main'>
                    <SlInput label='Vendor Code' onSlChange={(e)=> setSendVendorData({...sendVendorData,vendor_id:e.target.value})}></SlInput>
                    <SlInput type='date' label='Start Date' onSlChange={(e)=> setSendVendorData({...sendVendorData,start_date:e.target.value})}></SlInput>
                    <SlInput type='date' label='End Date'  onSlChange={(e)=> setSendVendorData({...sendVendorData,end_date:e.target.value})}></SlInput>
                    <SlButton variant='primary' onClick={()=>{
                        getAttendanceByVendor()
                    }}>Search</SlButton>
                </div>
                <div style={{"marginTop":"5vh"}} className='table-ceam'>
                <MUIDataTable
                        title="Attendance Data ( Vendor )"
                        data={vendorData}
                        columns={EmployeeColumn}
                        options={options}>

                </MUIDataTable>
                </div>
            </div>
        </SlDetails>
        <SlDetails className='sl-details' summary="Search By Plant">
        <div className='attendance-search-main'>
                <div className='attendance-search-input-main'>
                    <SlInput label='Employee Code' onSlChange={(e)=> setSendPlantData({...sendPlantData,plant_name:e.target.value})}></SlInput>
                    <SlInput type='date' label='Start Date' onSlChange={(e)=> setSendPlantData({...sendPlantData,start_date:e.target.value})}></SlInput>
                    <SlInput type='date' label='End Date' onSlChange={(e)=> setSendPlantData({...sendPlantData,end_date:e.target.value})}></SlInput>
                    <SlButton variant='primary' onClick={()=>{
                        getAttendanceByPlantName()
                    }}>Search</SlButton>
                </div>
                <div style={{"marginTop":"5vh"}} className='table-ceam'>
                <MUIDataTable
                        title="Attedance Data ( Plant )"
                        data={plantData}
                        columns={EmployeeColumn}
                        options={options}>

                </MUIDataTable>
                </div>
            </div>
        </SlDetails>
    </div>
  )
}

export default ViewAttendance