import { SlButton, SlDetails, SlInput, SlMenuItem, SlSelect } from '@shoelace-style/shoelace/dist/react/index'
import './ViewAttendance.css'
import React, { useState } from 'react'
import MUIDataTable from 'mui-datatables'
import axios from 'axios';
import { baseurl } from '../../api/apiConfig';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

function ViewAttendance() {

    useEffect(()=>{
        getData()
        getCategory()
        getDeptList()
        getVendorlist()
    },[])

    /* MAx date states */
    const [searchMaxDate, setSearchMaxDate] = useState('')
    const [vendorList, setVendorList] = useState()
    const [divisionList, setDivisionList] = useState([])
  
      const [plantList, setPlantList] = useState()
      const [deptList, setDeptList] = useState()
      const [categoryList, setCategoryList] = useState()

    

    const [sendEmployeeData, setSendEmployeeData] = useState({
        start_date:"",
        end_date:"",
        employee_id:"",
        category:"",
        gender:"",
        vendor:"",
        plant:"",
        division:"",
        department:""
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
            label:"Reward Attendance",
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
        rowsPerPage:15
    }

    function getAttendanceByEmployee(){
        console.log(sendEmployeeData);
        axios({
            method: 'post',
            url: `${baseurl.base_url}/mhere/get-attendance-by-variable`,
            headers: {
              'Content-Type': 'application/json',
            },
            data:sendEmployeeData
          })
          .then((res)=>{
            console.log(res.data.data);
            
            let data = res.data.data;
            data.forEach((item) => {
                item.InTime=`${item.InTime.split("T")[1].split(":")[0]}:${item.InTime.split("T")[1].split(":")[1]}`
                item.OutTime=`${item.OutTime.split("T")[1].split(":")[0]}:${item.OutTime.split("T")[1].split(":")[1]}`
                item.employee_working_minutes = `${parseInt(item.employee_working_minutes/60)}H ${item.employee_working_minutes - (parseInt(item.employee_working_minutes/60)*60)}M`
  
            });
            setEmployeeData(data);
          })
          .catch((err)=>{
            console.log(err);
            toast.error(err.response.data.message)
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
      function addDays(myDate) {
       let date= new Date(myDate);
        let next_date = new Date(date.setDate(date.getDate() + 62));
        var todayDate = next_date.toISOString().slice(0, 10);
        //console.log(todayDate);
        setSearchMaxDate(todayDate)
//return new Date(myDate.getTime() + 62*24*60*60*1000);
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
    <div className='view-attendance-main'>
       <div className='attendance-search-main'>
                <div className='attendance-search-input-main'>
                    <SlInput label='Employee Code' onSlChange={(e)=> setSendEmployeeData({...sendEmployeeData,employee_id:e.target.value})}></SlInput>
                    <SlSelect className='add-emp-input' label="Select Category" onSlChange={(e)=>{setSendEmployeeData({...sendEmployeeData,category:e.target.value})}}>
            {
                categoryList?.map((item,i)=>{
             return(
              <SlMenuItem key={`${i}cat`} value={item.category}>{item.category}</SlMenuItem>
             )})}
            </SlSelect>
            <SlSelect className='add-emp-input' label="Select Vendor Code" onSlChange={(e)=>{
              setSendEmployeeData({...sendEmployeeData,vendor:JSON.parse(e.target.value).vendor_code})
            }}>
              {
                vendorList?.map((item,i)=>{
             return(
              <SlMenuItem key={`${i}ven`} value={JSON.stringify(item)}>{item.vendor_name} ( {item.vendor_code} )</SlMenuItem>
             )

                })
              }
            </SlSelect>
            <SlSelect className='add-emp-input' label="Select Department" onSlChange={(e)=>{setSendEmployeeData({...sendEmployeeData,department:e.target.value})}}>
              {
                deptList?.map((item,i)=>{
             return(
              <SlMenuItem key={`${i}dept`} value={item.department}>{item.department}</SlMenuItem>
             )

                })
              }
            </SlSelect>
            <SlSelect className='add-emp-input' label="Select Plant" onSlChange={(e)=>{ getDivision(e.target.value);setSendEmployeeData({...sendEmployeeData,plant:e.target.value})}}>
            {
                plantList?.map((item,i)=>{
             return(
              <SlMenuItem key={`${i}plant`} value={item.plant}>{item.plant}</SlMenuItem>
             )})}
            </SlSelect>
            <SlSelect className='add-emp-input' label="Select Division" onSlChange={(e)=>{setSendEmployeeData({...sendEmployeeData,division:e.target.value})}}>
            {divisionList?.map((item,i)=>{
            return(
              <SlMenuItem key={`${i}divisionu`} value={item.division}>{item.division}</SlMenuItem>

            )            
            })}
            
            </SlSelect>
            <SlSelect className='add-emp-input' label="Select Gender" onSlChange={(e)=>{setSendEmployeeData({...sendEmployeeData,gender:e.target.value})}}>
              <SlMenuItem value="M">Male</SlMenuItem>
              <SlMenuItem value="F">Female</SlMenuItem>
            </SlSelect>
                    <SlInput type='date' label='Start Date' onSlChange={(e)=> {addDays(e.target.value);setSendEmployeeData({...sendEmployeeData,start_date:e.target.value})}}></SlInput>
                    <SlInput type='date' label='End Date' max={searchMaxDate} onSlChange={(e)=> setSendEmployeeData({...sendEmployeeData,end_date:e.target.value})}></SlInput>
                    <SlButton variant='primary' onClick={()=>{
                        getAttendanceByEmployee()
                    }}>Search</SlButton>
                </div>
                <div style={{"marginTop":"5vh","padding":"0px"}} className='table-ceam report-table'>
                <MUIDataTable
                        title="Attendance Data"
                        data={employeeData}
                        columns={EmployeeColumn}
                        options={options}>

                </MUIDataTable>
                </div>
            </div>
    </div>
  )
}

export default ViewAttendance