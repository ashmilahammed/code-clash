import { Outlet } from "react-router-dom";
import UserNavbar from "./UserNavbar";


const UserLayout = () => {
  return (
    <div className="min-h-screen bg-[#0B1220]">
      {/* Fixed navbar */}
      <UserNavbar />

      {/* Page content */}
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;





// import { Outlet } from "react-router-dom";
// import UserNavbar from "./UserNavbar";
// import Snowfall from "react-snowfall";

// const UserLayout = () => {
//   return (
//     <div className="relative min-h-screen bg-[#0B1220]">
      
//       {/* Snow overlay ABOVE everything */}
//       <Snowfall
//         snowflakeCount={150}
//         style={{
//           position: "fixed",
//           width: "100%",
//           height: "100%",
//           top: 0,
//           left: 0,
//           zIndex: 9999, // high value
//           pointerEvents: "none", // important!
//         }}
//       />

//       <UserNavbar />

//       <main className="pt-16">
//         <Outlet />
//       </main>
//     </div>
//   );
// };

// export default UserLayout;