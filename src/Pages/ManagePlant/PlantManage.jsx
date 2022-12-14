import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import './PlantManage.css'
import axios from "axios";
import { baseurl } from "../../api/apiConfig";
import { SlTag } from "@shoelace-style/shoelace/dist/react/index";
function PlantManage() {

   // const [col, setCol] = useState([])
    const [plantData, setPlantData] = useState([])

    useEffect(()=>{
        getPlantData()
    },[])
    
    const options = {
        tableBodyMaxHeight: '64vh',
        responsive: 'standard',
        selectableRowsHideCheckboxes: true,
        //customToolbar: CustomToolbar ,
    }

    const col =[
        {
            name: "plant",
            label: "Plant",
            options: {
                filter: true,
                sort: true,
            }
        },
        {
            name: "division",
            label: "Division",
            options: {
                filter: true,
                sort: true,
            }
        },
        {
            name: "active",
            label: "Active",
            options: {
                filter: true,
                sort: true,
            }
        },
        {
            name: "Update",
            options: {
                filter: false,
                sort: false,
                empty: true,
                customBodyRenderLite: (dataIndex, rowIndex) => {
                    return (
                        <SlTag variant='primary' size="small" className="tag-row" onClick={e => { 
                        }} style={{ zIndex: "20", cursor: "pointer" }}>
                            Update
                        </SlTag>
                    );
                }
            }
        },
        {
            name: "Delete",
            options: {
                filter: false,
                sort: false,
                empty: true,
                customBodyRenderLite: (dataIndex, rowIndex) => {
                    return (
                        <SlTag variant='primary' size="small" className="tag-row" onClick={e => {
                           
                        }} style={{ zIndex: "20", cursor: "pointer" }}>
                            Delete
                        </SlTag>
                    );
                }
            }
        },
    ]

    function getPlantData() {
        axios({
          method: 'get',
          url: `${baseurl.base_url}/mhere/get-roster-location`,
          headers: {
            'Content-Type': 'application/json',
          }
        })
        .then((res)=>{
          console.log(res);
          setPlantData(res.data.data)

        })
        .catch((err)=>{
          console.log(err);
        })
        
      }

  return (
    <div className="plant-manage-main">
     <div className="plant-manage-table-main">
     <MUIDataTable
        title="Manage Data"
        data={plantData}
        columns={col}
        options={options}
      ></MUIDataTable>
     </div>
     
    </div>
  );
}

export default PlantManage;
