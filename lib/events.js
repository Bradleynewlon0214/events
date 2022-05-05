// import fs from 'fs';

// export function getAllEvents(){
//   const fileContents = fs.readFileSync("C:\\Users\\branewlon\\Documents\\classes-events\\pages\\event\\events.json", 'utf-8');
//   var events = JSON.parse(fileContents);
//   const types = ['Classes', 'Events', 'Screenings', 'Support Groups'];
//   for(var i = 0; i < events.length; i++){
//     const randomIndex = Math.random() * types.length;
//     events[i].type = types[randomIndex];
//   }
//   console.log(events);
//   return JSON.parse(fileContents);
// }

// export function getAllEventIds(){
//   const events = getAllEvents();
//   return events.map((event, idx) => {
//     return {
//       params: {
//         id: `${idx}`
//       }
//     }
//   })
// }