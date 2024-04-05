import React, { useEffect, useState } from "react";
import mapImage from "./srilankaMap.png"; // replace with your map image
import axios from "axios";
import { TooltipWrapper } from "./Tootltip";
import io from 'socket.io-client';

const SriLankaMap = () => {
  const [districtInfo, setDistrictInfo] = useState(null);

  const districts = [
    { id: 1, name: "Colombo", coordinates: [170, 530.9260] },
    { id: 2, name: "Kandy", coordinates: [290.2134, 466.0428] },
    { id: 3, name: "Gampaha", coordinates: [180.2134, 480.0428] },
    { id: 4, name: "Matale", coordinates: [300.2134, 386.0428] },
    { id: 5, name: "Kalutara", coordinates: [190.2134, 566.0428] },
    { id: 6, name: "Nuwara Eliya", coordinates: [330.2134, 496.0428] },
    { id: 7, name: "Galle", coordinates: [210.2134, 636.0428] },
    { id: 8, name: "Matara", coordinates: [280.2134, 676.0428] },
    { id: 9, name: "Hambantota", coordinates: [330.2134, 666.0428] },
    { id: 10, name: "Jaffna", coordinates: [190.2134, 32.0428] },
    { id: 11, name: "Mannar", coordinates: [200.2134, 206.0428] },
    { id: 12, name: "Vavuniya", coordinates: [270.2134, 186.0428] },
    { id: 13, name: "Mullaitivu", coordinates: [280.2134, 116.0428] },
    { id: 14, name: "Batticaloa", coordinates: [430.2134, 356.0428] },
    { id: 15, name: "Ampara", coordinates: [480.2134, 466.0428] },
    { id: 16, name: "Trincomalee", coordinates: [370.2134, 256.0428] },
    { id: 17, name: "Kurunegala", coordinates: [230.2134, 386.0428] },
    { id: 18, name: "Puttalam", coordinates: [180.2134, 316.0428] },
    { id: 19, name: "Kegalle", coordinates: [250.2134, 476.0428] },
    { id: 20, name: "Kilinochchi", coordinates: [210.2134, 100.0428] },
    { id: 21, name: "Monaragala", coordinates: [420.2134, 536.0428] },
    { id: 22, name: "Anuradhapura", coordinates: [270.2134, 266.0428] },
    { id: 23, name: "Polonnaruwa", coordinates: [360.2134, 326.0428] },
    { id: 24, name: "Badulla", coordinates: [370.0152, 499.6689] },
    { id: 25, name: "Ratnapura", coordinates: [290.0152, 569.6689] },
   
  ];

  useEffect(()=>{
    loadDistrictData();

    // Connect to the Socket.IO server
    const socket = io("http://localhost:3030"); 

    socket.on('wD', (data) => {

      let wData = data ? data : [];

      let weatherDtArray = [];

      for (const dis of wData) {
          let disObj = districts.find((d) => d.id === dis.WS_id)

          if(disObj){
            let obj = {
              ...disObj,
              dateTime: dis.dateTime,
              temperature: dis.temperature,
              humidity: dis.humidity,
              airPressure: dis.airPressure,
            }
            weatherDtArray.push(obj);
          }
      }

      setDistrictInfo(weatherDtArray);
    });

    // Cleanup function to disconnect the socket
    return () => {
        socket.disconnect();
    };
  },[])

  
  const loadDistrictData = async (name) => {
    try {
      const response = await axios.get("http://localhost:3030/loadData");

      let wData = response.data ? response.data : [];

      let weatherDtArray = [];

      for (const dis of wData) {
          let disObj = districts.find((d) => d.id === dis.WS_id)

          if(disObj){
            let obj = {
              ...disObj,
              dateTime: dis.dateTime,
              temperature: dis.temperature,
              humidity: dis.humidity,
              airPressure: dis.airPressure,
            }
            weatherDtArray.push(obj);
          }
      }

      setDistrictInfo(weatherDtArray);
    } catch (error) {
      console.error("Error fetching district information:", error);
    }
  };

  return (
     <div style={{  textAlign: "center", position: "relative" }}>
      <svg style={{zIndex:"100", position:"absolute", height: "100vh", width: "37vw"}}>
        
        {districtInfo && districtInfo.map((district, index) => {
          return <React.Fragment key={index}>
            <g>
            <TooltipWrapper placement="bottom" text={[district.name+" District",<u/>,<br/>,<br/>,"Date & Time : "+new Date(district.dateTime).toLocaleString(),<br/>,"Temperature : "+district.temperature+"℃", <br/>,"Humidity : "+district.humidity+"%rh",<br/>,"Air Pressure : "+district.airPressure+"atm" ]} bcolor="black" >
              <circle 
                key={index}
                cx={district.coordinates[0]}
                cy={district.coordinates[1]}
                r="5"
                fill="darkred"
                />
            </TooltipWrapper>   
          </g>
          </React.Fragment>
           
        })}
      </svg>
      <img src={mapImage} alt="Sri Lanka map" style={{ height: "100vh" }} />
      {districtInfo && (
        <div>
          <h2>{districtInfo.name}</h2>
         
        </div>
      )}
    </div>
  );
};

export default SriLankaMap;